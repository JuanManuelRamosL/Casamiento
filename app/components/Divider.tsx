export function Divider({
  tone = "dorado",
}: {
  tone?: "dorado" | "principal";
}) {
  const lineColor = tone === "dorado" ? "shimmer-line" : "bg-principal/40";
  return (
    <div className="flex items-center justify-center gap-0" aria-hidden="true">
      <span className="mark-diamond" />
      <span className={`h-px w-14 sm:w-20 ${lineColor}`} />
      <span className={`h-px w-14 sm:w-20 ${lineColor}`} />
      <span className={`h-px w-14 sm:w-20 ${lineColor}`} />
      <span className="mark-diamond" />
    </div>
  );
}
