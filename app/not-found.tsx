/*
Project: Eclipse
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell" style={{ padding: "2rem 0" }}>
      <h1>Story not found</h1>
      <p className="notice">The requested story could not be located.</p>
      <Link className="button" href="/">
        Return to library
      </Link>
    </main>
  );
}
