import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";
import gsap from "gsap";

const Landing = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .from(".hero-badge", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 25,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-actions",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        );

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.15,
        delay: 0.8,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Search,
      title: "Discover Scholarships",
      description:
        "Find scholarships based on your education, course, category, income, location, and other eligibility criteria.",
    },
    {
      icon: Sparkles,
      title: "Personalized Matching",
      description:
        "Build your student profile and discover scholarship opportunities that match your eligibility.",
    },
    {
      icon: ShieldCheck,
      title: "Track Applications",
      description:
        "Keep your scholarship applications organized and monitor their status from one place.",
    },
  ];

  return (
    <div
      ref={heroRef}
      className="min-h-screen bg-slate-950 text-white overflow-hidden"
    >
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <GraduationCap size={23} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Scholar<span className="text-blue-400">Net</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/scholarships"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Scholarships
            </Link>

            <Link
              to="/login"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>

          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold md:hidden"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="relative">
          <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

          <div className="relative z-10 mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
            {/* Hero Content */}
            <div>
              <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <Sparkles size={16} />
                Smart Scholarship Discovery
              </div>

              <h1 className="hero-title max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Find the{" "}
                <span className="text-blue-400">
                  right scholarship
                </span>{" "}
                for your future.
              </h1>

              <p className="hero-description mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
                ScholarNet helps students discover scholarships that match
                their education, financial background, category, location,
                academic performance, and eligibility requirements.
              </p>

              <div className="hero-actions mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-500"
                >
                  Create Your Profile
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/scholarships"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Explore Scholarships
                </Link>
              </div>
            </div>

            {/* Hero Card */}
            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-6 rounded-3xl bg-blue-500/10 blur-3xl" />

                <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Scholarship Match
                      </p>

                      <h3 className="mt-1 text-xl font-semibold">
                        Personalized for you
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Sparkles size={22} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        name: "Merit Scholarship",
                        amount: "₹50,000",
                        match: "94%",
                      },
                      {
                        name: "State Education Grant",
                        amount: "₹35,000",
                        match: "89%",
                      },
                      {
                        name: "Higher Education Support",
                        amount: "₹25,000",
                        match: "86%",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium">
                              {item.name}
                            </h4>

                            <p className="mt-1 text-sm text-slate-400">
                              Financial assistance
                            </p>
                          </div>

                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                            {item.match}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-semibold text-blue-400">
                            {item.amount}
                          </span>

                          <span className="text-xs text-slate-500">
                            Match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/10 bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Everything in one place
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Simplify your scholarship journey
              </h2>

              <p className="mt-4 text-slate-400">
                From discovering opportunities to tracking applications,
                ScholarNet keeps the entire process organized.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    ref={(element) => {
                      cardsRef.current[index] = element;
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-blue-500/30"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
            <div className="rounded-3xl border border-blue-400/10 bg-blue-500/5 px-6 py-12">
              <GraduationCap
                className="mx-auto text-blue-400"
                size={42}
              />

              <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
                Start finding opportunities today
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Create your profile and discover scholarship opportunities
                that fit your academic and personal eligibility.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-500"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} ScholarNet. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              to="/scholarships"
              className="transition hover:text-slate-300"
            >
              Scholarships
            </Link>

            <Link
              to="/login"
              className="transition hover:text-slate-300"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="transition hover:text-slate-300"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;