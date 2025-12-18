import "./globals.css";

export const metadata = {
  title: "CallSetter.ai",
  description: "AI voice agents that call, qualify, and book leads in under 60 seconds.",
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
