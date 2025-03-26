import { Request, Response } from "express";
import GamePlatform from "../models/game_platforms.model";

export async function getAllGamesPlatforms(req: Request, res: Response) {
    try {
        const gamesPlatforms = await GamePlatform.findAll();
        res.status(200).json(gamesPlatforms);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des games : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des games' })
        
    }
}

export async function addGamePlatform(req: Request, res: Response) {
    const {game_id, platform_id, compatible_device, release_date, price, stock  } = await req.body;
    try{
        if (!game_id || !platform_id || !compatible_device|| compatible_device.length === 0 || !release_date || !price || !stock) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }
        const newGamePlatorm = await GamePlatform.create({
            game_id,
            platform_id,
            compatible_device,
            release_date, // Stocke les données binaires directement
            price,
            stock
        });
        res.status(201).json({message:'Ajout de la platform au game:', data: newGamePlatorm});

    }catch(error:any){
        if(error.code===11000){
            res.status(400).json({message: 'Cette platform est déjà inscrite dans ce game!'});
            return 
        }
        console.error("Erreur lors de l'ajout de la platform au game : ", error);
        res.status(500).json({ message: "Erreur lors de la l'ajout de la platform au game "});
    }
}

export async function deleteGamePlatform(req: Request, res: Response) {
    const {id} = await req.params; //faux
    try{
        if ( !id) {
            res.status(400).json({ message: 'Vous devez taper un id de relation game_platform' });
            return;
        }
        const gamePlatform = await GamePlatform.findByPk(id);
        if(!gamePlatform){
            res.status(404).json({message: 'Platform non trouvée'});
            return;
        }
        await gamePlatform.destroy();
        res.status(200).json({message: 'Platform supprimée avec succès'});
    }catch(error:any){
        console.error("Erreur lors de la modification de la platform : ", error);
        res.status(500).json({ message: "Erreur lors de la modification de la platform "});
    }
}

