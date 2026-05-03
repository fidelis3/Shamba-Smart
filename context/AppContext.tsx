"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { CropImage } from "../lib/types";
import { uid } from "../lib/utils";
import { detectDisease } from "../lib/diseaseApi";

interface AppContextType {
  images: CropImage[];
  setImages: React.Dispatch<React.SetStateAction<CropImage[]>>;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  addFiles: (fileList: FileList | File[]) => void;
  removeImage: (id: string) => void;
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

  return (
    <AppContext.Provider
      value={{
        images,
        setImages,
        activeId,
        setActiveId,
        addFiles,
        removeImage,
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
