import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 113,
          background: "#ff6600",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontSize: 317,
          fontWeight: 700,
          letterSpacing: -23,
        }}
      >
        B
      </div>
    ),
    { width: 512, height: 512 }
  );
}
