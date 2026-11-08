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
          background: "#ff6600",
        }}
      >
        <svg viewBox="0 0 100 100" width="149.76" height="149.76">
          <path
            fill="#ffffff"
            d="M22.5 24h14.2L50 45.6 63.3 24h14.2L57.1 56.4V76H42.9V56.4L22.5 24Z"
          />
        </svg>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
