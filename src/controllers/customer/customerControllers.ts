import { Request, Response } from "express";
import Customer from "../../models/customer.model";
import { verifyPassword } from "../../utils/pwdUtils";
import Joi from "joi";

/**
 * Récupère le profil du client connecté via les infos du token, avec createdAt, age et historique de commandes.
 */
export async function getCustomerProfil(req: Request, res: Response) {
    const customerId = req.user?.id;

    if (!customerId) {
        res.status(401).json({ message: "Authentification requise" });
        return;
    }

    try {
        const customer = await Customer.findByPk(customerId, {
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "birthdate",
                "phone",
                "adress",
                "createdAt",
                "order_history"
            ]
        });
        if (!customer) {
            res.status(404).json({ message: "Client non trouvé" });
            return;
        }

        // Historique des commandes (tableau d'IDs)
        const order_history = customer.getDataValue("order_history") || [];

        res.status(200).json({
            profil: {
                id: customer.getDataValue("id"),
                first_name: customer.getDataValue("first_name"),
                last_name: customer.getDataValue("last_name"),
                email: customer.getDataValue("email"),
                birthdate: customer.getDataValue("birthdate"),
                phone: customer.getDataValue("phone"),
                adress: customer.getDataValue("adress"),
                createdAt: customer.getDataValue("createdAt"),
                order_history
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil client", error: error.message });
    }
}

// Schéma de validation pour la mise à jour du compte client
const updateCustomerSchema = Joi.object({
    phone: Joi.string().min(10).max(15).pattern(/^[0-9]+$/).messages({
        'string.pattern.base': '"phone" doit contenir uniquement des chiffres.',
        'string.min': '"phone" doit comporter au moins 10 caractères.',
        'string.max': '"phone" doit comporter au maximum 15 caractères.',
    }),
    adress: Joi.string().min(10).max(255).messages({
        'string.min': '"adress" doit comporter au moins 10 caractères.',
        'string.max': '"adress" doit comporter au maximum 255 caractères.',
    }),
    birthdate: Joi.date().iso().messages({
        'date.base': '"birthdate" doit être une date valide.',
        'date.format': '"birthdate" doit être au format ISO (YYYY-MM-DD).'
    }),
    password: Joi.string().min(2).required().messages({
        'string.min': '"password" doit comporter au moins 2 caractères.',
        'any.required': '"password" est requis.'
    })
});

/**
 * Met à jour le numéro de téléphone, l'adresse et la date de naissance d'un client après vérification du mot de passe.
 * Le client doit fournir son mot de passe, et au moins un champ à modifier.
 */
export async function updateCustomerAccount(req: Request, res: Response) {
    const customerId = req.user?.id;

    if (!customerId) {
        res.status(401).json({ message: "Authentification requise" });
        return;
    }

    // Extraction des champs depuis le corps de la requête
    const { password, phone, adress, birthdate } = req.body;

    // Validation des champs
    const { error } = updateCustomerSchema.validate({ password, phone, adress, birthdate });
    if (error) {
        res.status(400).json({ message: "Erreur de validation", details: error.details });
        return;
    }

    if (!phone && !adress && !birthdate) {
        res.status(400).json({ message: "Aucun champ à mettre à jour (phone, adress ou birthdate requis)" });
        return;
    }

    try {
        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            res.status(404).json({ message: "Client non trouvé" });
            return;
        }

        const isPasswordValid = await verifyPassword(password, customer.getDataValue("hashedpassword"));
        if (!isPasswordValid) {
            res.status(401).json({ message: "Mot de passe incorrect" });
            return;
        }

        if (phone) customer.set("phone", phone);
        if (adress) customer.set("adress", adress);
        if (birthdate) customer.set("birthdate", birthdate);

        await customer.save();

        res.status(200).json({
            message: "Compte client mis à jour",
            data: {
                phone: customer.getDataValue("phone"),
                adress: customer.getDataValue("adress"),
                birthdate: customer.getDataValue("birthdate")
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du compte client", error: error.message });
    }
}

