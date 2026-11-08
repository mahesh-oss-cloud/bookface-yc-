import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Bookface — The YC founder community",
  description:
    "A private founder community with a searchable directory of YC companies and founders, peer discussions, messaging, and resources.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteChrome email={process.env.BOOKFACE_LOGIN_EMAIL ?? ""}>
          {children}
        </SiteChrome>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "13px",
              background: "#fff",
              border: "1px solid #e7e5e4",
              borderRadius: "8px",
              color: "#111110",
            },
          }}
        />
      </body>
    </html>
  );
}
