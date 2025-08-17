import bcrypt from "bcryptjs";

export function hash(token: string): string {
  return bcrypt.hashSync(token, 10);
}