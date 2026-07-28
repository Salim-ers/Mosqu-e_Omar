import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mosquée Omar Ibn al Khattab — Creil",
    short_name: "Mosquée Omar",
    description:
      "Horaires de prière, activités et vie de la mosquée Omar Ibn al Khattab de Creil (Oise).",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F5EF",
    theme_color: "#181816",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
