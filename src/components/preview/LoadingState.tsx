export default function LoadingState() {
  return (
    <main
      id="konten"
      aria-busy="true"
      aria-label="Memuat halaman"
      className="p-6 max-w-[1440px] mx-auto"
    >
      <div className="h-12 w-48 bg-[#f0f0f0] rounded-xl mb-8" />
      <div className="h-80 bg-[#f0f0f0] rounded-2xl animate-pulse" />
      <p className="text-sm text-[#52525b]">Memuat halaman...</p>
    </main>
  );
}
