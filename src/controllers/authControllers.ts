import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import { generateToken } from '../utils/JWTUtils';
import Customer from '../models/customer.model';
import User from '../models/staff.model';
import { customerLoginValidationSchema, customerValidationSchema, staffLoginValidationSchema, staffValidationSchema } from '../JoiValidators/authValidators';


export async function customerRegister(req: Request, res: Response) {
    try {
        // Validation des données d'entrée avec Joi
        const { error } = customerValidationSchema.validate(req.body);
        
        if (error) {
            // Si la validation échoue, on retourne les erreurs
           res.status(400).json({ message: 'Erreur de validation', details: error.details });
           return ;
        }

        const { first_name, last_name, email, adress, password } = req.body;

        // Vérifier si un client avec le même email existe déjà (gestion de duplication)
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
            res.status(400).json({ message: 'Ce customer existe déjà !' });
            return ;
        }

        // Création du client dans la base de données
        const customer = await Customer.create({
            first_name,
            last_name,
            adress,
            email,
            hashedpassword: await hashPassword(password), // Hashage du mot de passe
        });

        // Réponse avec le client créé
        res.status(201).json(customer);
    } catch (err: any) {
        // Gestion des erreurs internes
        console.error("Erreur lors de la création du client:", err);
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

export async function customerLogin(req: Request, res: Response) {
    try {
        // Validation des données
        const { error } = customerLoginValidationSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "Erreur de validation", details: error.details });
            return;
        }

        const { email, password } = req.body;

        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            res.status(404).json({ message: "Customer non trouvé" });
            return;
        }
        console.log('customer.hashedpassword:', customer.hashedpassword);
        const isPasswordValid = await verifyPassword(password, customer.hashedpassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Mot de passe incorrect" });
            return;
        }

        const token = generateToken({
            id: customer.id,
            email: customer.email,
            type: "Customer",
        });

        res.cookie("jwt", token, { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "Connexion réussie", token });
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur Interne", error: err.message });
        return;
    }
}


export async function staffRegister(req: Request, res: Response) {
    try {
        // Validation des données d'entrée avec Joi
        const { error } = staffValidationSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "Erreur de validation", details: error.details });
            return;
        }

        const { first_name, surname, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà dans la base de données
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Cet utilisateur existe déjà !" });
            return;
        }

        // Création du nouveau utilisateur
        const user = await User.create({
            first_name,
            surname,
            email,
            hashedpassword: await hashPassword(password),
        });

        res.status(201).json(user);
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur Interne", error: err.message });
        return;
    }
}

export async function staffLogin(req: Request, res: Response) {
    try {
        // Validation des données d'entrée avec Joi
        const { error } = staffLoginValidationSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "Erreur de validation", details: error.details });
            return;
        }

        const { email, password } = req.body;

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }

        // Vérification du mot de passe
        const isPasswordValid = await verifyPassword(password, user.hashedpassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Mot de passe incorrect" });
            return;
        }

        // Création du jeton JWT pour la connexion
        const token = generateToken({
            id: user.id,
            email: user.email,
            type: "User",
            role: user.role, // Ajout du rôle
        });

        res.cookie("jwt", token, { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "Connexion réussie", token });
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur Interne", error: err.message });
        return;
    }
}
