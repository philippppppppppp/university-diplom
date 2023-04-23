interface RefreshTokenEntry {
  token: string;
  userId: string;
}

const refreshTokens: RefreshTokenEntry[] = [];

const add = (token: string, userId: string) => {
  refreshTokens.push({ token, userId });
};

const find = (token: string) => {
  refreshTokens.find((t) => t.token === token);
};

const remove = (token: string) => {
  refreshTokens.filter((t) => t.token !== token);
};

export { add, find, remove };
