import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserSchema from '../DBSchemas/UserSchema';

export async function isAdminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const cookie = req.headers.cookie;
       
        if (!cookie) {
            res.status(401).json({ message: 'Accès refusé. Token manquant.' });
            return;
        }

        const token = cookie.split('=')[1];
        
        const decoded: any = jwt.verify(token, process.env.JWT_KEY!);

        const user = await UserSchema.findById(decoded.id);
        
        if (!user || user.role !== 'admin') {
            res.status(403).json({ message: 'Accès refusé. Vous devez être Admin !' });
            return;
        }
        next();

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Erreur d'authentification", error: error.message });
        } else {
            res.status(500).json({ message: "Erreur d'authentification", error: String(error) });
        }
    }
};