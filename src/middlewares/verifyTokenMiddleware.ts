import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyToken } from '../utils/JWTUtils';

dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!SECRET_KEY) {
        throw new Error('SECRET KEY is not defined');
    }

    console.log("Cookies reçus :", req.headers.cookie);

    const cookie = req.headers.cookie;
    if (!cookie) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }

    const token = cookie.split('=')[1];
    console.log("Token extrait :", token);

    if (!token) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }

    try {
        const decoded = verifyToken(token);
        console.log("Token décodé :", decoded);

        if (!decoded || typeof decoded !== 'object' || !decoded.id) {
            res.status(403).json({ message: "Token invalide ou expiré" });
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.type === "User" ? decoded.role : "Customer",
            type: decoded.type,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
}


