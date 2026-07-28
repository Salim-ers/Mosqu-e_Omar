export default function Loading() {
  return (
    <div
      className="flex min-h-[70svh] items-center justify-center bg-ivory pt-28"
      role="status"
      aria-label="Chargement de la page"
    >
      <div className="flex flex-col items-center gap-5">
        <span
          aria-hidden
          className="block h-3 w-3 rotate-45 animate-pulse bg-beige motion-reduce:animate-none"
        />
        <p className="text-[0.68rem] font-semibold tracking-[0.3em] text-taupe uppercase">
          Chargement
        </p>
      </div>
    </div>
  );
}
