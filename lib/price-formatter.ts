export const priceFormatter = (price: number) =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
