export const metadata = {
  title: "CallSetter.ai — AI Appointment Setter",
  description: "Increase Your Booked Appointments By 25% In 30 Days Guaranteed."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
