"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function MainPage() {
  return (
    <div className="serif min-h-screen text-[#102015] dark:text-[#ddedd8] bg-[radial-gradient(circle_at_20%_10%,#dbf7c8_0%,#f3faef_38%,#ecf7e6_100%)] dark:bg-[radial-gradient(circle_at_20%_8%,#16301f_0%,#0d1b12_40%,#081109_100%)]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 lg:py-16 flex flex-col gap-10 sm:gap-14">
        <section className="fade-up">
          <div className="space-y-4 w-full">

            <h1 className="serif w-full text-center text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[#15311d] dark:text-[#ecf8e7]">
              <span>Healthier crops Better harvests</span>
            </h1>
            <p className="w-full text-xl sm:text-base leading-relaxed text-[#2a4d32] dark:text-[#b9d5bd]">
              Farming is hard enough already. ShambaSmart helps you spot disease early, estimate yield clearly, and keep records organized so decisions feel simpler every day.
            </p>

            <p className="text-lg text-[#3a653f] dark:text-[#a6c6ab]">
              Built with farmers in mind: clear steps, practical insights, and no unnecessary complexity.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                href="/diseases"
                className="inline-flex items-center gap-2 bg-[#4f8a3c] dark:bg-[#78b45d] hover:bg-[#3f7130] dark:hover:bg-[#8bcf6a] text-[#f5fff0] dark:text-[#102010] text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Start Disease Check
                <span aria-hidden="true">→</span>
              </Link>
            
            </div>
          </div>
        </section>

        <section className="fade-up rounded-3xl border border-[#4f8a3c]/20 dark:border-[#8ecb73]/25 bg-[#f5fceb] dark:bg-[#122419] p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-5">
             <p className="mono text-[11px] tracking-[.12em] uppercase text-[#3c6a2f] dark:text-[#98ca84]">How It Works</p>
          </div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#66a64c]/20 dark:border-[#8ecb73]/25 bg-[#fbfff7] dark:bg-[#173022] p-4">
              <p className="mono text-[11px] tracking-widest uppercase text-[#4f8a3c] dark:text-[#9fd387] mb-2">Step 1</p>
              <h3 className="serif text-xl text-[#173320] dark:text-[#e8f6e2] mb-1">Capture your crop</h3>
              <p className="text-sm text-[#2c4b33] dark:text-[#b6d2ba]">Upload or take a photo of your crop to analyze its health status.</p>
            </div>
            <div className="rounded-2xl border border-[#66a64c]/20 dark:border-[#8ecb73]/25 bg-[#fbfff7] dark:bg-[#173022] p-4">
              <p className="mono text-[11px] tracking-widest uppercase text-[#4f8a3c] dark:text-[#9fd387] mb-2">Step 2</p>
              <h3 className="serif text-xl text-[#173320] dark:text-[#e8f6e2] mb-1">Get diagnosis</h3>
              <p className="text-sm text-[#2c4b33] dark:text-[#b6d2ba]">Receive instant disease detection and actionable recommendations.</p>
            </div>
            
          </div>
        </section>

        <section className="fade-up rounded-3xl border border-[#4f8a3c]/20 dark:border-[#8ecb73]/25 bg-[#f5fceb] dark:bg-[#122419] p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-5">
            <p className="mono text-[11px] tracking-widest uppercase text-[#3c6a2f] dark:text-[#98ca84]">What You Can Do</p>
          </div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#66a64c]/20 dark:border-[#8ecb73]/25 bg-[#fbfff7] dark:bg-[#173022] p-4">
              <p className="mono text-[11px] tracking-widest uppercase text-[#4f8a3c] dark:text-[#9fd387] mb-2">Feature 1</p>
              <h3 className="serif text-xl text-[#173320] dark:text-[#e8f6e2] mb-1">Scan crop health</h3>
              <p className="text-sm text-[#2c4b33] dark:text-[#b6d2ba]">Upload crop images and get clear disease signals before issues spread.</p>
            </div>
            <div className="rounded-2xl border border-[#66a64c]/20 dark:border-[#8ecb73]/25 bg-[#fbfff7] dark:bg-[#173022] p-4">
              <p className="mono text-[11px] tracking-widest uppercase text-[#4f8a3c] dark:text-[#9fd387] mb-2">Feature 2</p>
              <h3 className="serif text-xl text-[#173320] dark:text-[#e8f6e2] mb-1">Get actionable advice</h3>
              <p className="text-sm text-[#2c4b33] dark:text-[#b6d2ba]">Receive practical next steps you can apply directly in the field.</p>
            </div>
            
          </div>
        </section>
      </main>

      <footer className="border-t border-[#4f8a3c]/20 dark:border-[#81bb67]/20 bg-[#eaf7df] dark:bg-[#0e1a11]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-[#2f5b24] dark:text-[#b6d2ba]">
            Better field decisions start with simple, trusted insights.
          </p>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-[#2f5b24] dark:text-[#b6d2ba]">
            <Link href="/diseases" className="hover:text-[#1f3f17] dark:hover:text-[#d9efce]">Disease Tools</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

