"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { ImageCard } from "@/components/ImageCard";
import { CameraModal } from "@/components/CameraModal";
import { SEV_STYLES, URGENCY, fmtPct, fmtTime } from "@/lib/utils";

export default function DiseasesPage() {
  const {
    images,
    setImages,
    addFiles,
    removeImage,
    setActiveId,
    activeId,
  } = useAppContext();

  const [dragOver, setDragOver] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const doneImages = images.filter((i) => i.status === "done" && i.report);
  const activeImage = doneImages.find((img) => img.id === activeId) || doneImages[0];
  const report = activeImage?.report;

  const goToDiagnostics = (id: string) => {
    setActiveId(id);
    setDiagnosticsOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDiagnosticsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f0d] text-[#102015] dark:text-[#deecd8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-12">
        {/* Minimal Hero */}
        <div className="fade-up mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-[#79ae49]/10 dark:border-[#79ae49]/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#122615] dark:text-[#eaf5e4] tracking-tight">
                Crop Disease Detection
              </h1>
              <p className="text-[12px] sm:text-[13px] text-[#4c6652] dark:text-[#8aa68f] max-w-md">
                Upload or capture images to identify diseases and get actionable insights instantly.
              </p>
            </div>
            <Link
              href="/"
              className="mono text-[12px] px-3 py-2 rounded-xl border border-black/10 dark:border-white/8 shrink-0"
            >
              ← Back
            </Link>
          </div>
        </div>

     
        {images.length > 0 && (
          <div className="fade-up flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-[13px] sm:text-sm font-semibold text-[#122615] dark:text-[#eaf5e4]">
                  Uploaded Images
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#79ae49]/10 dark:bg-[#79ae49]/20 text-[#79ae49] dark:text-[#b6df8c] text-[10px] sm:text-[11px] font-medium">
                  {images.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {doneImages.length > 0 && (
                  <button
                    onClick={() => goToDiagnostics(doneImages[0].id)}
                    className="hidden sm:flex items-center gap-1.5 text-[#79ae49] hover:text-[#8dbd5e] dark:text-[#b6df8c] dark:hover:text-[#c5e8a0] font-medium text-[12px] transition-colors"
                  >
                    <span>View Diagnostics</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => {
                    setImages([]);
                    setActiveId(null);
                    setDiagnosticsOpen(false);
                  }}
                  className="text-[#4f6e56] dark:text-[#7b9780] hover:text-red-500 dark:hover:text-red-400 text-[11px] sm:text-[12px] font-medium transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
              {images.map((img, i) => (
                <ImageCard
                  key={img.id}
                  img={img}
                  index={i + 1}
                  onRemove={() => removeImage(img.id)}
                  onAnalyze={() => goToDiagnostics(img.id)}
                />
              ))}
            </div>

            {doneImages.length > 0 && (
              <button
                onClick={() => goToDiagnostics(doneImages[0].id)}
                className="sm:hidden flex items-center justify-center gap-2 w-full text-[#79ae49] hover:text-[#8dbd5e] dark:text-[#b6df8c] dark:hover:text-[#c5e8a0] bg-[#79ae49]/5 dark:bg-[#79ae49]/10 hover:bg-[#79ae49]/10 dark:hover:bg-[#79ae49]/20 font-medium text-[13px] py-2.5 rounded-lg transition-colors"
              >
                <span>View All Diagnostics</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Minimalist Upload Zone */}
        <div
          className={`fade-up relative rounded-lg sm:rounded-xl border-2 border-dashed transition-all duration-200
          flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12 px-4 sm:px-6 text-center
          ${dragOver
              ? "border-[#79ae49] bg-[#79ae49]/5 cursor-copy"
              : "border-[#79ae49]/20 dark:border-[#79ae49]/30 hover:border-[#79ae49]/40 dark:hover:border-[#79ae49]/50 hover:bg-[#f9fdf7] dark:hover:bg-[#0f1712] cursor-pointer"
            }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#79ae49]/10 dark:bg-[#79ae49]/20 flex items-center justify-center text-xl sm:text-2xl">
            🌾
          </div>

          <div className="flex flex-col gap-0.5 sm:gap-1">
            <p className="text-[13px] sm:text-[14px] font-medium text-[#122615] dark:text-[#eaf5e4]">
              Drop images here or click to browse
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#4c6652] dark:text-[#8aa68f]">
              JPG, PNG, WEBP up to 8MB
            </p>
          </div>

          {/* Action buttons */}
          <div
            className="flex items-center gap-2 flex-wrap justify-center w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#79ae49] hover:bg-[#8dbd5e] text-white font-medium text-[11px] sm:text-[12px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-colors touch-manipulation"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[14px] sm:h-[14px]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Browse Files
            </button>
            <button
              onClick={() => setCameraOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#0f1712] hover:bg-[#f9fdf7] dark:hover:bg-[#141b17] text-[#122615] dark:text-[#eaf5e4] border border-[#79ae49]/20 dark:border-[#79ae49]/30 hover:border-[#79ae49]/40 dark:hover:border-[#79ae49]/50 font-medium text-[11px] sm:text-[12px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all touch-manipulation"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[14px] sm:h-[14px]">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
              </svg>
              Take Photo
            </button>
          </div>
        </div>

      </main>

      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {/* Camera Modal */}
      {cameraOpen && (
        <CameraModal
          onClose={() => setCameraOpen(false)}
          onCapture={(file) => {
            addFiles([file]);
            setCameraOpen(false);
          }}
        />
      )}

      {diagnosticsOpen && activeImage && report && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] p-3 sm:p-6 overflow-y-auto"
          onClick={() => setDiagnosticsOpen(false)}
        >
          <div
            className="relative mx-auto w-full max-w-5xl rounded-3xl border border-[#79ae49]/25 bg-[#f9fdf7] dark:bg-[#0e1712] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 rounded-t-3xl border-b border-[#79ae49]/15 dark:border-[#79ae49]/20 bg-[#f9fdf7]/95 dark:bg-[#0e1712]/95 backdrop-blur px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="mono text-[10px] uppercase tracking-[.12em] text-[#4f8a3c] dark:text-[#9fd387]">Diagnostics</p>
                <h2 className="text-base sm:text-lg font-semibold text-[#173320] dark:text-[#e8f6e2] truncate max-w-[70vw]">
                  {activeImage.name}
                </h2>
              </div>
              <button
                onClick={() => setDiagnosticsOpen(false)}
                className="w-9 h-9 rounded-xl border border-[#4f8a3c]/25 dark:border-[#8ecb73]/30 text-[#2f5b24] dark:text-[#b8dfaa] hover:bg-[#79ae49]/10 transition-colors"
                aria-label="Close diagnostics modal"
              >
                ✕
              </button>
            </div>

            <div className="p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              <div className="col-span-1 lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-[#79ae49]/15 dark:border-[#79ae49]/20 bg-white dark:bg-[#122019]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeImage.url || activeImage.preview}
                    alt={activeImage.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="p-3 border-t border-[#79ae49]/10 dark:border-[#79ae49]/20">
                    <p className="text-sm font-medium text-[#173320] dark:text-[#e8f6e2]">{report.cropType || "Unknown Crop"}</p>
                    <p className="mono text-[11px] text-[#4c6652] dark:text-[#8aa68f]">
                      Uploaded {activeImage.uploadedAt ? fmtTime(new Date(activeImage.uploadedAt)) : "recently"}
                    </p>
                  </div>
                </div>

                {doneImages.length > 1 && (
                  <div className="mt-4">
                    <p className="mono text-[11px] uppercase tracking-[.1em] text-[#4c6652] dark:text-[#8aa68f] mb-2">Other Uploads</p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {doneImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveId(img.id)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                            img.id === activeImage.id ? "border-[#79ae49]" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url || img.preview} alt={img.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-1 lg:col-span-7 space-y-5">
                {URGENCY[report.urgency] && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${URGENCY[report.urgency].style}`}>
                    <span className={`block w-2.5 h-2.5 rounded-full ${URGENCY[report.urgency].dot}`} />
                    <span className="text-[12px] font-semibold uppercase tracking-wide">{URGENCY[report.urgency].label}</span>
                  </div>
                )}

                <section className="rounded-2xl border border-[#79ae49]/15 dark:border-[#79ae49]/20 bg-white dark:bg-[#121d17] p-4 sm:p-5">
                  <h3 className="text-lg font-bold text-[#173320] dark:text-[#e8f6e2] mb-4">Predicted Pathologies</h3>
                  <div className="space-y-4">
                    {report.diseases.map((d, idx) => {
                      const style = SEV_STYLES[d.severity] || SEV_STYLES.low;
                      return (
                        <div key={`${d.name}-${idx}`} className="space-y-2">
                          <div className="flex items-end justify-between gap-2">
                            <div>
                              <p className={`font-semibold ${style.text}`}>{d.name}</p>
                              <p className="mono text-[11px] uppercase tracking-[.08em] text-[#4c6652] dark:text-[#8aa68f]">{d.severity} risk</p>
                            </div>
                            <p className="mono text-[12px] sm:text-[13px] text-[#173320] dark:text-[#e8f6e2]">{fmtPct(d.probability)}</p>
                          </div>
                          <div className="h-2 rounded-full bg-[#eaf2e5] dark:bg-[#0d1510] overflow-hidden">
                            <div className={`${style.bar} h-full rounded-full`} style={{ width: `${Math.max(2, d.probability * 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border border-[#79ae49]/15 dark:border-[#79ae49]/20 bg-gradient-to-br from-[#79ae49]/10 to-[#5a8a31]/5 dark:from-[#1b2b1e] dark:to-[#101a13] p-4 sm:p-5">
                  <h3 className="text-lg font-bold text-[#173320] dark:text-[#e8f6e2] mb-4">Actionable advice</h3>
                  <ul className="space-y-3">
                    {report.advice.map((line, i) => (
                      <li key={`${line}-${i}`} className="flex items-start gap-3 p-3 rounded-xl border border-white/60 dark:border-white/5 bg-white/60 dark:bg-[#0a140d]/40 text-[13px] sm:text-sm text-[#1b3d26] dark:text-[#add39b]">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-[#79ae49] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}