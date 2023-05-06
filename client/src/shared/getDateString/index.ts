export const getDateString = (date: string) => {
  return new Date(date).toLocaleDateString("uk-UA");
};
