/*
Project: Eclipse
Owned by :contentReference[oaicite:2]{index=2}
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eclipse v1.0.0",
  description: "Reader-first short story library with community reviews.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

