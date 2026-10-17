export function rupiah(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formatted}`;
}

export function formatAngka(num: number): string {
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function persen(num: number, decimals = 1): string {
  const fixed = num.toFixed(decimals).replace(".", ",");
  return `${fixed}%`;
}

export function formatScore(num: number): string {
  return num.toFixed(2).replace(".", ",");
}
