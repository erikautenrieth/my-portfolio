"use client";

import dynamic from "next/dynamic";

// Loaded client-side only, after first paint — keeps LCP unaffected.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneLoader() {
  return <Scene />;
}
