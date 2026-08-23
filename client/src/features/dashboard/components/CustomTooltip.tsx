interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; fill?: string }[];
  label?: string;
  formatter?: (name: string) => string;
}

export function CustomTooltip({
  active,
  payload,
  label,
  formatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-lg text-sm">
      {label && (
        <p className="mb-1.5 font-semibold text-foreground">
          {formatter ? formatter(label) : label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          {entry.fill && (
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
          )}
          <span className="text-muted-foreground">
            {formatter ? formatter(entry.name) : entry.name}:
          </span>
          <span className="font-semibold text-foreground">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}