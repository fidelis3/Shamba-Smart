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
              <h3 className="serif text-xl text-[#173320] dark:text-[#e8f6e2] mb-1">Collect location</h3>
              <p className="text-sm text-[#2c4b33] dark:text-[#b6d2ba]">Allow your farm location permissions first so every report is linked to the correct field.</p>
            </div>
            <div className="rounded-2xl border border-[#66a64c]/20 dark:border-[#8ecb73]/25 bg-[#fbfff7] dark:bg-[#173022] p-4">
              <p className="mono text-[11px] tracking-widest uppercase text-[#4f8a3c] dark:text-[#9fd387] mb-2">Step 2</p>
              <h3 className="serif text-xl text-[#173320] dark:text-[#e8f6e2] mb-1">Run disease check</h3>
              <p className="text-sm text-[#2c4b33] dark:text-[#b6d2ba]">Analyze crop health next to quickly detect issues and get useful recommendations.</p>
            </div>
            
          </div>
        </section>

        <section className="fade-up rounded-3xl border border-[#4f8a3c]/20 dark:border-[#8ecb73]/25 bg-gradient-to-b from-[#f8fff2] to-[#edf8e6] dark:from-[#14261b] dark:to-[#102117] p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <p className="mono text-[11px] tracking-[.12em] uppercase text-[#3c6a2f] dark:text-[#98ca84]">What You Can Do</p>
            <h2 className="serif text-2xl sm:text-3xl text-[#173320] dark:text-[#e8f6e2] mt-2">
              Practical tools for everyday farming decisions
            </h2>
            <p className="text-sm sm:text-base text-[#2f5b37] dark:text-[#b6d2ba] mt-2">
              Use simple workflows to detect issues faster and act with confidence.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
            {[
              {
                title: "Scan crop health",
                body: "Upload crop images and get clear disease signals before issues spread.",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3h6l1 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3l-1 2H9l-1-2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
              },
              {
                title: "Track location context",
                body: "Tie reports to your farm location so diagnosis context stays accurate.",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
                    <circle cx="12" cy="11" r="2.5" />
                  </svg>
                ),
              },
              {
                title: "Get actionable advice",
                body: "Receive practical next steps you can apply directly in the field.",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a7 7 0 0 0-4 12.8V19a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.2A7 7 0 0 0 12 3z" />
                    <path d="M9 21h6" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-[#4f8a3c]/20 dark:border-[#8ecb73]/25 bg-white/80 dark:bg-[#122419]/80 backdrop-blur-sm p-5 sm:p-6 hover:shadow-lg hover:shadow-[#4f8a3c]/10 hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#66a64c]/15 dark:bg-[#89c66f]/15 border border-[#66a64c]/30 dark:border-[#8ecb73]/35 text-[#2f5b24] dark:text-[#b8dfaa] flex items-center justify-center mb-4 mx-auto transition-transform duration-300 group-hover:scale-105">
                  {feature.icon}
                </div>
                <h3 className="serif text-xl text-[#173320] dark:text-[#e8f6e2] mb-2 leading-tight">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#2c4b33] dark:text-[#b6d2ba]">{feature.body}</p>
              </article>
            ))}
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

