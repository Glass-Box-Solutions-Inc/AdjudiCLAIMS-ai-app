/**
 * Home / Dashboard route.
 *
 * This is the landing page after authentication. It will eventually
 * display claim summaries, queue counts, and recent activity.
 */
export default function Home() {
  return (
    <main className="home">
      <header className="home-header">
        <h1>AdjudiCLAIMS</h1>
        <p className="tagline">
          Augmented Intelligence for CA Workers Compensation Claims
          Professionals
        </p>
      </header>

      <section className="dashboard-placeholder">
        <p>Dashboard content will appear here.</p>
        {/* TODO: Phase 1 -- Claim queue summary cards */}
        {/* TODO: Phase 1 -- Recent activity feed */}
        {/* TODO: Phase 2 -- AI assistant entry point */}
      </section>
    </main>
  );
}
