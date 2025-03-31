import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import { generateToken } from '../utils/JWTUtils';
import Customer from '../models/customer.model';
import User from '../models/staff.model';


export async function customerRegister(req:Request, res:Response) {
    try {
        const{first_name,last_name,email,password} = req.body;
        if (!first_name || !last_name || !email || !password) {
            res.status(400).json({message: "Veuillez remplir tous les champs"});
            return;

    }
    const customer = await Customer.create({
        first_name,
        last_name,
        email,
        hashedpassword : await hashPassword(password),
    });
    res.status(201).json(customer);
    }catch (err:any) {
        if(err.code===11000){
            res.status(400).json({message: 'Ce customer existe déjà !'});
            return 
        }
    res.status(500).json({message: "Erreur Interne", error: err.message});
    }
}

export async function customerLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: "Veuillez remplir tous les champs" });
            return;
        }

        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            res.status(404).json({ message: 'Customer non trouvé' });
            return;
        }

        const isPasswordValid = await verifyPassword(password, customer.hashedpassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe incorrect' });
            return;
        }

        // ✅ Ajouter "type: Customer" directement dans le token
        const token = generateToken({
            id: customer.id,
            email: customer.email,
            type: "Customer",
        });

        res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Connexion réussie' });
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur Interne", error: err.message });
        return;
    }
}


export async function staffRegister(req:Request, res:Response) {
    try {
        const{first_name,surname,email,password} = req.body;
        if (!first_name || !surname || !email || !password) {
            res.status(400).json({message: "Veuillez remplir tous les champs"});
            return;

    }
    const user = await User.create({
        first_name,
        surname,
        email,
        hashedpassword : await hashPassword(password),
    });
    res.status(201).json(user);
    }catch (err:any) {
        if(err.code===11000){
            res.status(400).json({message: 'Cet user existe déjà !'});
            return 
        }
    res.status(500).json({message: "Erreur Interne", error: err.message});
    }
}

export async function staffLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: "Veuillez remplir tous les champs" });
            return;
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User non trouvé' });
            return;
        }

        const isPasswordValid = await verifyPassword(password, user.hashedpassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe incorrect' });
            return;
        }

        // ✅ Ajouter "type: User" et "role" directement dans le token
        const token = generateToken({
            id: user.id,
            email: user.email,
            type: "User",
            role: user.role, // Ajout du rôle
        });

        res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Connexion réussie', token });
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur Interne", error: err.message });
        return;
    }
}
