import "./globals.css";

export const metadata = {
  title: "Call Setter AI",
  description: "AI voice agents that call, qualify, and book inbound leads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
