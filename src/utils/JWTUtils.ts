import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY: string | undefined = process.env.JWT_KEY;

export interface UserJwtPayload extends JwtPayload {
    id: number;
    email: string;
    role: string;
    type: string;
}

export function generateToken(payload: UserJwtPayload): string {
    if (!SECRET_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '4h' });
}

export function verifyToken(token: string): UserJwtPayload | null {
    if (!SECRET_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    try {
        return jwt.verify(token, SECRET_KEY) as UserJwtPayload;
    } catch {
        return null;
    }
}