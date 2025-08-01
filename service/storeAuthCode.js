const authCodeStore = new Map();

function storeAuthCode(email, code, ttl = 5 * 60 * 1000) {
  const expiresAt = Date.now() + ttl;
  authCodeStore.set(email, { code, expiresAt });
}

function getStoredAuthCode(email) {
  const record = authCodeStore.get(email);
  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    authCodeStore.delete(email);
    return null;
  }
  return record.code;
}

module.exports = { storeAuthCode, getStoredAuthCode };
