export const getPhoneString = (phone: string) => {
  return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(
    6,
    8
  )}-${phone.substring(8)}`;
};
