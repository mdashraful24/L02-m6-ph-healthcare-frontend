export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatFee(fee: number | string | null | undefined) {
  if (fee === null || fee === undefined || fee === "") return "N/A";
  return `$${Number(fee).toLocaleString()}`;
}
