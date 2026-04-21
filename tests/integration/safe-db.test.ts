import mongoose from 'mongoose';
import { afterAll, describe, expect, it } from 'vitest';

describe('safe test database isolation', () => {
  it('connects to isolated local test db and performs isolated writes', async () => {
    const uri = process.env.MONGO_URI;
    expect(uri).toBeDefined();
    expect(uri).toMatch(/^mongodb:\/\/(127\.0\.0\.1|localhost)/i);

    await mongoose.connect(uri as string);

    const schema = new mongoose.Schema({
      value: String,
    });

    const Model = mongoose.models.SafetyProbe || mongoose.model('SafetyProbe', schema);

    await Model.create({ value: 'ok' });
    const count = await Model.countDocuments({ value: 'ok' });

    expect(count).toBe(1);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
});
