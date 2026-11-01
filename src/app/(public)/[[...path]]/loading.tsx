export default function PublicLoading() {
  return (
    <main
      id="konten"
      aria-busy="true"
      className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center px-6 py-16"
    >
      <p role="status" className="text-sm text-[#52525b]">
        Memuat informasi website...
      </p>
    </main>
  );
}
