export const toApiArray = (array: Array<string | number>) => {
  return `{${array.join(", ")}}`;
};
