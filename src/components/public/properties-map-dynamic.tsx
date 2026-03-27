"use client";

import dynamic from "next/dynamic";
import type { MapProperty } from "./properties-map";

const PropertiesMap = dynamic(
  () => import("./properties-map").then((m) => m.PropertiesMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] rounded-2xl bg-[#F0EBE3] animate-pulse border border-[#E0D8CC]" />
    ),
  }
);

export { PropertiesMap };
export type { MapProperty };
