import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Safety guardrail failed: NODE_ENV must be test before running tests.');
  }

  const mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'app-schools-reg-v2-test',
    },
  });

  process.env.MONGO_URI = mongod.getUri('app-schools-reg-v2-test');

  return async () => {
    await mongod.stop();
  };
}
