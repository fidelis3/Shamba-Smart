"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { CropImage, LocationData } from "../lib/types";
import { uid } from "../lib/utils";
import { detectDisease } from "../lib/diseaseApi";

interface AppContextType {
  images: CropImage[];
  setImages: React.Dispatch<React.SetStateAction<CropImage[]>>;
  location: LocationData | null;
  locationStatus: "idle" | "requesting" | "granted" | "denied";
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  addFiles: (fileList: FileList | File[]) => void;
  removeImage: (id: string) => void;
  requestLocation: () => Promise<LocationData | null>;
  setLocationStatus: (status: "idle" | "requesting" | "granted" | "denied") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const IMAGES_STORAGE_KEY = "shambasmart:images:v1";

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<CropImage[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Keeps the original File object keyed by image id so we can send it
  // to the AI endpoint after local file staging.
  const fileMapRef = useRef<Map<string, File>>(new Map());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IMAGES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CropImage[];
      if (!Array.isArray(parsed)) return;
      setImages(parsed);
    } catch (error) {
      console.error("Failed to restore persisted images:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error("Failed to persist images:", error);
    }
  }, [images]);

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    // Create placeholder entries and record the File reference
    const newImgs: CropImage[] = await Promise.all(
      files.map(async (f) => {
        const id = uid();
        fileMapRef.current.set(id, f);
        const dataUrl = await fileToDataUrl(f);
        return {
          id,
          name: f.name,
          size: f.size,
          preview: dataUrl,
          url: dataUrl,
          status: "uploading" as const,
        };
      })
    );
    setImages((prev) => [...prev, ...newImgs]);

    try {
      await Promise.all(
        newImgs.map(async (placeholder) => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === placeholder.id
                ? {
                    ...img,
                    // Keep url aligned to local preview for components that prefer `url`.
                    url: img.preview,
                    uploadedAt: new Date(),
                  }
                : img
            )
          );

          try {
            const originalFile = fileMapRef.current.get(placeholder.id);
            if (!originalFile) {
              throw new Error("Original file missing from local map");
            }
            const report = await detectDisease(originalFile);

            setImages((prev) =>
              prev.map((img) =>
                img.id === placeholder.id
                  ? { ...img, status: "done", report }
                  : img
              )
            );
          } catch (aiErr) {
            console.error("Disease detection failed for", placeholder.name, aiErr);
            setImages((prev) =>
              prev.map((img) =>
                img.id === placeholder.id ? { ...img, status: "error" } : img
              )
            );
          } finally {
            fileMapRef.current.delete(placeholder.id);
          }
        })
      );
    } catch (err) {
      console.error("File processing failed", err);
      setImages((prev) =>
        prev.map((img) => {
          if (!newImgs.find((n) => n.id === img.id)) return img;
          fileMapRef.current.delete(img.id);
          return { ...img, status: "error" };
        })
      );
    }
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
    if (activeId === id) setActiveId(null);
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!res.ok) return { geocoding: "failed" };
      const json = await res.json();
      const a = json.address ?? {};
      return {
        geocoding: "done",
        village: a.village || a.hamlet || a.locality || a.town || a.city_district || undefined,
        suburb: a.suburb || a.neighbourhood || a.residential || undefined,
        ward: a.ward || undefined,
        subCounty: a.county_district || a.subcounty || a.district || a.municipality || undefined,
        county: a.county || a.state_district || a.state || undefined,
        country: a.country || undefined,
        countryCode: (a.country_code || "").toUpperCase() || undefined,
        postcode: a.postcode || undefined,
        displayName: json.display_name || undefined,
      };
    } catch {
      return { geocoding: "failed" };
    }
  };

  const requestLocation = (): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      setLocationStatus("requesting");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const base: LocationData = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            capturedAt: new Date(),
            geocoding: "pending",
          };
          setLocation(base);
          setLocationStatus("granted");
          const geo = await reverseGeocode(base.lat, base.lng);
          const enriched = { ...base, ...geo };
          setLocation(enriched);
          resolve(enriched);
        },
        () => {
          setLocationStatus("denied");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  return (
    <AppContext.Provider
      value={{
        images,
        setImages,
        location,
        locationStatus,
        activeId,
        setActiveId,
        addFiles,
        removeImage,
        requestLocation,
        setLocationStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
