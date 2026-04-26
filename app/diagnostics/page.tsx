"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { SEV_STYLES, URGENCY, fmtPct, fmtTime } from "@/lib/utils";

export default function DiagnosticsPage() {
  const { images, activeId, setActiveId } = useAppContext();

  // Show the active image, or fallback to the first uploaded and "done" image
  const doneImages = images.filter((img) => img.status === "done" && img.report);
  const activeImage = doneImages.find((img) => img.id === activeId) || doneImages[0];

  if (doneImages.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9fdf7] dark:bg-[#0a0f0d] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center fade-up max-w-sm">
            <div className="w-16 h-16 rounded-full bg-[#79ae49]/10 dark:bg-[#79ae49]/20 flex items-center justify-center text-3xl mx-auto mb-4">
              📷
            </div>
            <h2 className="text-xl font-bold text-[#122615] dark:text-[#eaf5e4] mb-2">No diagnostics yet</h2>
            <p className="text-[13px] text-[#4c6652] dark:text-[#8aa68f] mb-6">
              You haven&apos;t uploaded any crop images to diagnose. Head back to the Disease Check page to run an analysis.
            </p>
            <Link
              href="/diseases"
              className="inline-flex items-center gap-2 bg-[#79ae49] hover:bg-[#8dbd5e] text-white font-medium text-[13px] px-6 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Go to Disease Check
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const report = activeImage.report;

  return (
    <div className="min-h-screen bg-[#f9fdf7] dark:bg-[#0a0f0d] flex flex-col font-sans text-[#122615] dark:text-[#eaf5e4]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-[#79ae49]/10 dark:border-[#79ae49]/20 fade-up">
          <div className="flex flex-col gap-2">
            <Link href="/diseases" className="mono text-[11px] uppercase tracking-wider text-[#79ae49] dark:text-[#a8d98f] hover:underline mb-1 w-max">
              ← Back to Uploads
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Diagnostic Results
            </h1>
            <p className="text-[13px] text-[#4c6652] dark:text-[#8aa68f]">
              Analyzing image <span className="font-semibold text-[#122615] dark:text-[#b6df8c]">{activeImage.name}</span>
            </p>
          </div>
          
          {report && URGENCY[report.urgency] && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${URGENCY[report.urgency].style} shrink-0 max-w-max`}>
              <span className={`block w-2.5 h-2.5 rounded-full animate-pulse ${URGENCY[report.urgency].dot}`} />
              <span className="text-[12px] font-semibold tracking-wide uppercase">
                {URGENCY[report.urgency].label}
              </span>
            </div>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image & Thumbnails */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 fade-up" style={{ animationDelay: '0.1s' }}>
            
            {/* Primary Image Viewer */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white dark:bg-[#0f1712] shadow-sm border border-[#79ae49]/10 dark:border-[#79ae49]/20 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={activeImage.url || activeImage.preview} 
                alt="Crop preview" 
                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                 <p className="text-white text-sm font-medium drop-shadow-md">
                   {report?.cropType || "Unknown Crop"}
                 </p>
                 <p className="text-white/80 text-[11px] font-mono mt-0.5">
                   Uploaded {activeImage.uploadedAt ? fmtTime(new Date(activeImage.uploadedAt)) : ""}
                 </p>
              </div>
            </div>

            {/* Thumbnail Strip (if multiple) */}
            {doneImages.length > 1 && (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-mono text-[#4c6652] dark:text-[#8aa68f] uppercase tracking-wider">Other Uploads</p>
                <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
                  {doneImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveId(img.id)}
                      className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                        img.id === activeImage.id 
                          ? "border-[#79ae49] scale-100 opacity-100" 
                          : "border-transparent scale-95 opacity-60 hover:opacity-100 hover:scale-[0.98]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url || img.preview} className="w-full h-full object-cover" alt="thumbnail" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Data & Advice */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-8 fade-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Predicted Diseases */}
            <div className="bg-white dark:bg-[#111a14] p-6 sm:p-8 rounded-[24px] shadow-sm border border-[#79ae49]/10 dark:border-[#79ae49]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#79ae49]/5 dark:bg-[#79ae49]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-[#79ae49]/10 dark:bg-[#79ae49]/20 flex items-center justify-center text-lg">
                  🦠
                </div>
                <h2 className="text-xl font-bold tracking-tight">Predicted Pathologies</h2>
              </div>

              <div className="space-y-5 relative z-10">
                {report?.diseases.map((d, idx) => {
                  const style = SEV_STYLES[d.severity] || SEV_STYLES.low;
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className={`text-sm sm:text-base font-semibold ${style.text}`}>{d.name}</p>
                          <p className="text-[11px] text-[#4c6652] dark:text-[#8aa68f] uppercase tracking-wider font-mono mt-0.5">
                            {d.severity} Risk
                          </p>
                        </div>
                        <span className="text-[14px] font-mono font-medium text-[#122615] dark:text-[#eaf5e4]">
                          {fmtPct(d.probability)}
                        </span>
                      </div>
                      
                      {/* Premium Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[#f0f5ed] dark:bg-[#0a0f0d] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar}`}
                          style={{ width: `${Math.max(2, d.probability * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actionable Advice */}
            <div className="bg-gradient-to-br from-[#79ae49]/10 to-[#5a8a31]/5 dark:from-[#1b2b1e] dark:to-[#0f1712] p-6 sm:p-8 rounded-[24px] border border-[#79ae49]/15 dark:border-[#79ae49]/25 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20 dark:opacity-10 text-6xl pointer-events-none blur-[1px]">💡</div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#0a140d] shadow-sm flex items-center justify-center text-lg">
                  💊
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#16321f] dark:text-[#eaf5e4]">Actionable Advice</h2>
              </div>
              
              <ul className="space-y-4 relative z-10">
                {report?.advice.map((line, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] sm:text-sm text-[#1b3d26] dark:text-[#add39b] leading-relaxed p-3 bg-white/40 dark:bg-[#0a140d]/40 border border-white/50 dark:border-white/5 rounded-xl backdrop-blur-sm">
                    <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-[#79ae49] text-white text-[10px] font-bold shadow-sm">
                      {i + 1}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
