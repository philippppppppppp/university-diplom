import rc from "rc";

export const config = rc("SERVER", {
  port: process.env.PORT ?? 8000,
  hasuraUrl: process.env.HASURA_URL ?? "http://localhost:8080/v1/graphql",
  hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET ?? "myadminsecretkey",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "myjwtsecretkey",
  jtwAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? "5m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "myrefreshjwtsecretkey",
  jtwRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "2w",
  accountActivationSecret:
    process.env.ACCOUNT_ACTIVATION_SECRET ?? "myaccountactivationsecretkey",
  accountActivationExpires:
    process.env.ACCOUNT_ACTIVATION_TOKEN_EXPIRES ?? "1h",
  passwordEncryptionRounds: process.env.PASSWORD_ENCRYPTION_ROUNDS
    ? +process.env.PASSWORD_ENCRYPTION_ROUNDS
    : 10,
  activationUrl: process.env.ACTIVATION_URL ?? "http://localhost:3000/activate",
});
