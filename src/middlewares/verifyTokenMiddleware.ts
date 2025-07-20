import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { verifyToken, UserJwtPayload } from '../utils/JWTUtils';

dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

const allowedRoles = ["Admin", "Storekeeper", "Employee", "Customer"] as const;
type Role = typeof allowedRoles[number];
const allowedTypes = ["User", "Customer"] as const;
type UserType = typeof allowedTypes[number];

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!SECRET_KEY) {
        throw new Error('SECRET KEY is not defined');
    }

    // Utilise cookie-parser pour lire le cookie JWT
    const token = req.cookies?.jwt || req.cookies?.token;

    if (!token) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }

    try {
        const decoded = verifyToken(token) as UserJwtPayload | null;

        if (
            !decoded ||
            typeof decoded !== 'object' ||
            !decoded.id ||
            !allowedRoles.includes(decoded.role as Role) ||
            !allowedTypes.includes(decoded.type as UserType)
        ) {
            res.status(403).json({ message: "Token invalide ou expiré" });
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role as Role,
            type: decoded.type as UserType,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
}


