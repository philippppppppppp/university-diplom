export const getIdFromJwt = (jwt: string) => {
  const payload = jwt.split(".")[1];
  const decoded = atob(payload);
  return JSON.parse(decoded).id;
};
