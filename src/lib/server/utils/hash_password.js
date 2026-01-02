import bcrypt from 'bcryptjs';

export async function generateHashPassword (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function compareHashPassword (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}
