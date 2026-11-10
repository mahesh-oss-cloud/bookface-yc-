import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import "./mobile-app.css";
import SiteChrome from "@/components/SiteChrome";
import { getBookfaceSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Bookface by Y Combinator",
  description:
    "A private founder community for discovering companies, connecting with founders, and staying close to your network.",
  applicationName: "Bookface",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/yc-logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/yc-logo-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bookface",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getBookfaceSession();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteChrome email={session?.email ?? ""}>
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
