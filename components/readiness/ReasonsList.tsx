interface ReasonsListProps {
  title: string;
  items: string[];
  emptyMessage: string;
  variant?: "positive" | "warning";
}

export function ReasonsList({
  title,
  items,
  emptyMessage,
  variant = "positive",
}: ReasonsListProps) {
  const isWarning = variant === "warning";

  return (
    <article
      className={[
        "rounded-2xl border p-6 shadow-sm",
        isWarning
          ? "border-amber-200 bg-amber-50"
          : "border-emerald-200 bg-emerald-50",
      ].join(" ")}
    >
      <h3 className="text-lg font-bold text-slate-950">
        {title}
      </h3>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-6 text-slate-700"
            >
              <span
                aria-hidden="true"
                className={
                  isWarning
                    ? "font-bold text-amber-700"
                    : "font-bold text-emerald-700"
                }
              >
                {isWarning ? "⚠" : "✓"}
              </span>

              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          {emptyMessage}
        </p>
      )}
    </article>
  );
}