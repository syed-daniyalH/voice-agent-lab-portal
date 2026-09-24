import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Keystone Voice Agent Portal | Voice AI & FastAPI",
  description: "Enterprise client handover portal for inbound trade voice agent operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <div style={{ flex: 1, marginLeft: "var(--sidebar-width)", minWidth: 0 }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
