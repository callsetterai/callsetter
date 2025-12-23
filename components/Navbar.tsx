export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="containerX flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600" />
          <div className="text-sm font-extrabold tracking-tight">CallSetterAI</div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 sm:flex">
          <a href="#home" className="hover:text-zinc-900">Home</a>
          <a href="#services" className="hover:text-zinc-900">Services</a>
          <a href="#roi" className="hover:text-zinc-900">ROI Calculator</a>
          <a href="#faqs" className="hover:text-zinc-900">FAQ’s</a>
          <a href="#contact" className="hover:text-zinc-900">Contact</a>
        </nav>

        <a href="#contact" className="btnPrimary">BOOK A DEMO</a>
      </div>
    </header>
  );
}
