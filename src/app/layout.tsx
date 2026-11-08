import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Bookface by Y Combinator",
  description:
    "A private founder community for discovering companies, connecting with founders, and staying close to your network.",
  applicationName: "Bookface",
  manifest: "/manifest.webmanifest",
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
