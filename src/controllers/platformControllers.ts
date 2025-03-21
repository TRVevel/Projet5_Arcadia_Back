import { Request, Response } from "express";
import Platform from "../models/platform.model";
export async function getAllPlatform(req: Request, res: Response) {
    try {
        const platforms = await Platform.findAll();
        res.status(200).json(platforms);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des platforms : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des platforms' })
        
    }
}