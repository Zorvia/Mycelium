/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { getAllStories } from "@/lib/stories";
import { LibraryClient } from "@/components/LibraryClient";

export default async function HomePage() {
  const stories = await getAllStories();

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">Mycelium</div>
        <div className="notice">v1.0.0</div>
      </header>

      <section className="hero">
        <h1>Reader-first short stories with community reviews.</h1>
        <p>
          Browse the library, open an immersive reader, and leave ratings and feedback. All
          credits to the Zorvia Community.
        </p>
      </section>

      <LibraryClient stories={stories} />

      <footer className="notice" style={{ paddingBottom: "2rem" }}>
        Licensed under ZPL v2.0 — see LICENSE.md.
      </footer>
    </main>
  );
}

