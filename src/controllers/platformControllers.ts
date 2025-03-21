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

export async function addPlatform(req: Request, res: Response) {
    const {name, devices} = await req.body;
    try{
        if (!name || !devices || devices.length === 0) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }
        const newGame = await Platform.create({
            name,
            devices
        });
        res.status(201).json({message:'Ajout de la platform:', data: newGame});

    }catch(error:any){
        if(error.code===11000){
            res.status(400).json({message: 'Cette platform est déjà inscrite!'});
            return 
        }
        console.error("Erreur lors de l'ajout de la platform : ", error);
        res.status(500).json({ message: "Erreur lors de la l'ajout de la platform "});
    }
}