// Форматирование денежных сумм с разделением разрядов точками: 50.234.244
// Используется везде, где показывается баланс/сумма счёта, чтобы числа
// читались одинаково и удобно.
export const formatKRW = (amount: number): string => {
  const rounded = Math.round(Math.abs(amount));
  const sign = amount < 0 ? "-" : "";
  return sign + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
