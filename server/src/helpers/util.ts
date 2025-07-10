const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
	try {
		return await bcrypt.hash(plainPassword, saltRounds);
	} catch (error) {
		console.log(error);
	}
};

export const comparePasswordHelper = async (plainPassword: string, hashPassword: string) => {
	try {
		return await bcrypt.compare(plainPassword, hashPassword);
	} catch (error) {
		console.log(error);
	}
};

export function getFrontendUri(): string {
  const frontendUri = process.env.FRONTEND_URI?.replace(/\/$/, '');
  if (!frontendUri) {
    throw new Error('FRONTEND_URI environment variable is not set');
  }
  return frontendUri;
}
