import Link from "next/link";
import { AiTripPlannerModal } from "../components/ai-trip-planner-modal";
import { WorldMapSection } from "../components/world-map-section";

export default function Home() {
  return (
    <main className="traveloop-page">
      <section className="traveloop-shell traveloop-spotlight traveloop-fade-up mx-auto flex w-full max-w-6xl flex-col rounded-[2rem]">
        <div className="traveloop-content border-b border-white/5 px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="max-w-2xl space-y-1">
              <p className="traveloop-kicker">Traveloop</p>
              <h1 className="traveloop-title mt-3 max-w-xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
                Personalized travel planning made easy.
              </h1>
              <p className="traveloop-copy mt-4 max-w-xl text-sm sm:text-base lg:text-lg">
                Design multi-city trips, track budgets, and share polished itineraries in a product that feels more like a funded startup than a school project.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 text-sm font-medium md:w-auto md:flex-row md:flex-wrap md:justify-end">
              <AiTripPlannerModal />
              <Link className="traveloop-button-secondary" href="/auth/login">
                Login
              </Link>
              <Link className="traveloop-button-primary" href="/dashboard">
                Open app
              </Link>
            </div>
          </div>
        </div>

        <div className="traveloop-content grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.45fr_0.85fr] lg:gap-6 lg:p-8">
          <section className="traveloop-card rounded-[1.75rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="traveloop-kicker text-amber-700">Wireframe map</p>
                <h2 className="traveloop-title mt-2 text-2xl font-semibold">Core product surfaces</h2>
              </div>
              <span className="traveloop-pill">Phase 1 foundation</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["Login / Signup", "/auth/login"],
                ["Dashboard", "/dashboard"],
                ["Create Trip", "/trips/new"],
                ["Trip Tracking", "/trips"],
                ["Itinerary Builder", "/trips"],
                ["Community Tab", "/community"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="traveloop-card-soft group rounded-2xl p-4 transition"
                >
                  <p className="text-base font-semibold text-slate-100">{label}</p>
                  <p className="mt-2 text-sm text-slate-500">Open the Traveloop screen</p>
                </Link>
              ))}
            </div>
          </section>

          <aside className="traveloop-gradient-panel traveloop-float rounded-[1.75rem] p-5 text-white sm:p-6">
            <p className="traveloop-kicker text-teal-200">MVP focus</p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-200">
              <li>Multi-city itinerary planning with stop-wise activities.</li>
              <li>Built-in city and activity discovery using internal catalog data.</li>
              <li>Hybrid budget view with transport, stay, meals, and activity costs.</li>
            </ul>
            <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-slate-900/10 p-4 text-sm text-slate-100 backdrop-blur-sm">
              Includes public share links and one-click trip copy workflow.
            </div>
          </aside>
        </div>
        <WorldMapSection />
      </section>
    </main>
  );
}
