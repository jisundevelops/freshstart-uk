import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function createOgImage(title: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #04080F 0%, #0A1628 50%, #0A1628 100%)",
          color: "#E8EDF5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#00D4FF",
            marginBottom: 24,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 1000,
            background: "linear-gradient(135deg, #00D4FF, #7B61FF, #00FF9D)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              color: "#6B7FA3",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    ),
    { ...ogSize }
  );
}
