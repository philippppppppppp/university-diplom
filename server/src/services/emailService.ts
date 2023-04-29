const activationUrl =
  process.env.ACTIVATION_URL ?? "http://localhost:3000/activate";

export const sendActivationToken = async (token: string) => {
  console.log("Registration activation token", `${activationUrl}/${token}`);
};
