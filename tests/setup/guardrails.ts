const uri = process.env.MONGO_URI;

if (process.env.NODE_ENV !== 'test') {
  throw new Error('Safety guardrail failed: NODE_ENV must be test.');
}

if (!uri) {
  throw new Error('Safety guardrail failed: MONGO_URI must be set for test runs.');
}

const isLocalMongo = /^mongodb:\/\/(127\.0\.0\.1|localhost)/i.test(uri);
if (!isLocalMongo) {
  throw new Error(`Safety guardrail failed: refusing non-local MONGO_URI: ${uri}`);
}

const looksUnsafe = /(prod|production|cluster|atlas|shared|staging)/i.test(uri);
if (looksUnsafe) {
  throw new Error(`Safety guardrail failed: suspicious MONGO_URI detected: ${uri}`);
}
