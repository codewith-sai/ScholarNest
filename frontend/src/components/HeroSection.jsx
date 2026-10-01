import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-slate-50"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        {/* Left content */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 sm:text-sm">
            <Sparkles size={15} />
            Find scholarships made for you
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Discover the{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              right scholarship
            </span>{" "}
            for your future.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            ScholarNet helps students discover scholarship
            opportunities based on their education,
            category, income, location, academic
            information and other eligibility requirements.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4">
                <Search
                  size={20}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search scholarships..."
                  className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <a
                href="#scholarships"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:from-indigo-700 hover:to-purple-700"
              >
                Search
                <ArrowRight size={17} />
              </a>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CheckCircle2
                size={18}
                className="text-emerald-500"
              />
              Eligibility-based discovery
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CheckCircle2
                size={18}
                className="text-emerald-500"
              />
              Document guidance
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CheckCircle2
                size={18}
                className="text-emerald-500"
              />
              Official application links
            </div>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative z-10">
          <div className="relative mx-auto max-w-lg">
            {/* Main card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-indigo-200/50 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Your opportunities
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    Scholarships for you
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <GraduationCap size={23} />
                </div>
              </div>

              {/* Scholarship item 1 */}
              <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <GraduationCap size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Merit Scholarship
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Academic Excellence Program
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        Match
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm font-black text-indigo-700">
                        ₹25,000
                      </p>

                      <p className="text-xs font-medium text-slate-500">
                        Deadline: 30 Nov
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scholarship item 2 */}
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <GraduationCap size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          State Education Scholarship
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Higher Education Support
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        Match
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm font-black text-purple-700">
                        ₹40,000
                      </p>

                      <p className="text-xs font-medium text-slate-500">
                        Deadline: 15 Dec
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scholarship item 3 */}
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600">
                    <GraduationCap size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Higher Education Grant
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Student Financial Assistance
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        Match
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm font-black text-fuchsia-700">
                        ₹30,000
                      </p>

                      <p className="text-xs font-medium text-slate-500">
                        Deadline: 20 Dec
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom info */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Potential matches
                  </p>

                  <p className="text-lg font-black text-slate-900">
                    12 Scholarships
                  </p>
                </div>

                <a
                  href="#scholarships"
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View all →
                </a>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2
                    size={20}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Eligibility checked
                  </p>

                  <p className="text-sm font-black text-slate-900">
                    Based on your profile
                  </p>
                </div>
              </div>
            </div>

            {/* Floating count */}
            <div className="absolute -right-4 -top-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
              <p className="text-xs font-semibold text-slate-500">
                Opportunities
              </p>

              <p className="mt-1 text-2xl font-black text-indigo-600">
                100+
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;