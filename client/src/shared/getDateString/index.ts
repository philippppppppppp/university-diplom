export const getDateString = (date: string) => {
  const dateObj = new Date(date);
  const formatedDate = dateObj.toLocaleDateString("uk-UA");
  const [hours, minutes] = dateObj.toLocaleTimeString().split(":");
  return `${formatedDate} ${hours}:${minutes}`;
};
