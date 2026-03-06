type RedisStub = {
  connect: () => Promise<void>;
  quit: () => Promise<void>;
};

export const redis: RedisStub = {
  connect: async () => undefined,
  quit: async () => undefined
};
