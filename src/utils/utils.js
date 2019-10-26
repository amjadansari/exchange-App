//@flow

export const toCurrencyString = (value: number, currency: string): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: currency
  });
};

export const hasClass = (element, className) => {
  do {
      if (element.classList && element.classList.contains(className)) {
        return true;
      }
      element = element.parentNode;
    } while (element);
    return false;
};