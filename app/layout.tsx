import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CallSetterAI",
  description: "Increase booked appointments with speed-to-lead automation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
