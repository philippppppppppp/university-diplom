interface RefreshTokenEntry {
  token: string;
  userId: string;
}

const refreshTokens: RefreshTokenEntry[] = [];

const add = async (token: string, userId: string) => {
  refreshTokens.push({ token, userId });
};

const find = async (token: string) => {
  return refreshTokens.find((t) => t.token === token);
};

const remove = async (token: string) => {
  refreshTokens.filter((t) => t.token !== token);
};

export { add, find, remove };
