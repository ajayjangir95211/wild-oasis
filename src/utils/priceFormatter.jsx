export const priceFormatter = (price) =>
  new Intl.NumberFormat(undefined, {
    currency: "INR",
    style: "currency",
    minimumFractionDigits: 0, // Remove unnecessary decimals
    maximumFractionDigits: 2, // Retain up to 2 decimals if necessary
  }).format(price);
