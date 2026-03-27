"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(
  () => import("./property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] rounded-2xl bg-[#F0EBE3] animate-pulse border border-[#E0D8CC]" />
    ),
  }
);

export { PropertyMap };
