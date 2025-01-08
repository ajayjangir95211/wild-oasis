const getShortMonth = new Intl.DateTimeFormat(undefined, {
  month: "short",
}).format;

export const dateFormatter = (date) =>
  `${date.getFullYear()} ${getShortMonth(date)} ${date.getDate()} `;
