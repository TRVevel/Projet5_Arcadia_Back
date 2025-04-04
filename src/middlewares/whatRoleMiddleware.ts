import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: "Admin" | "Storekeeper" | "Employee" | "Customer";
                type: "User" | "Customer";
            };
        }
    }
}

export function authorizeRoles(...allowedRoles: ("Customer" | "Employee" | "Storekeeper" | "Admin")[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Vérifie si l'utilisateur est authentifié (présence de req.user)
        if (!req.user) {
            res.status(401).json({ message: "Utilisateur non authentifié." });
            return;
        }

        // Récupère le rôle et type de l'utilisateur depuis req.user
        const userRole = req.user.role;
        const userType = req.user.type;

        // Si l'utilisateur est Admin, on l'accepte toujours
        if (userRole === "Admin") {
            return next();
        }

        // Vérifie si l'utilisateur est autorisé en fonction de son rôle ou type
        if (!allowedRoles.includes(userType === "Customer" ? "Customer" : userRole)) {
            res.status(403).json({ message: "Accès interdit. Rôle insuffisant." });
            return;
        }

        // L'utilisateur est autorisé, passe au prochain middleware ou à la fonction
        next();
    };
}
