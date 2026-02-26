import bcrypt from 'bcryptjs';

export async function generateHashPassword (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export function compareHashPassword (password, hashPassword) {
  return bcrypt.compare(password, hashPassword);
}
