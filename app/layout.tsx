import "./globals.css";

export const metadata = {
  title: "CallSetter.ai",
  description: "AI appointment setter that calls, qualifies, and books inbound leads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
