export default function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
      <p className="mt-1 text-[var(--mut)]">{sub}</p>
    </div>
  );
}
