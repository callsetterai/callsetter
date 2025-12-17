export const metadata = {
  title: "Call Setter AI",
  description: "AI voice agents that call, qualify, and book inbound leads fast.",
  metadataBase: new URL("https://your-vercel-domain.com"),
  openGraph: {
    title: "Call Setter AI",
    description: "Increase booked appointments by 25% in 30 days.",
    images: ["/og.png"]
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
