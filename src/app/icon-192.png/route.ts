import { createElement } from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const icon = createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 42,
        background: "#ff6600",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: 119,
        fontWeight: 700,
        letterSpacing: -9,
      },
    },
    "B"
  );

  return new ImageResponse(icon, { width: 192, height: 192 });
}
