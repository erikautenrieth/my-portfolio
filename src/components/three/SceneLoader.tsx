"use client";

import dynamic from "next/dynamic";
import type { DnaAnnotation } from "./DnaHelix";

// Loaded client-side only, after first paint — keeps LCP unaffected.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneLoader({ annotations }: { annotations: DnaAnnotation[] }) {
  return <Scene annotations={annotations} />;
}
