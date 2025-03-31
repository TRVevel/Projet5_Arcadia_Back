import { Request, Response } from "express";
import { validateSchema } from "../../utils/joiUtils";
import Game from "../../models/game.model";
import { gameSchema } from "../../JoiValidators/gamesValidators";
export async function getAllGames(req: Request, res: Response) {
    try {
        const games = await Game.findAll();
        res.status(200).json(games);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des games : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des games' })
        
    }
}

export async function addGame(req: Request, res: Response) {
    const {title, description, genre, sub_genres,pegi, sensitive_content} = validateSchema(req.body, gameSchema);
    try{
        if (!title || !description || !genre || !sub_genres || !pegi || !sensitive_content) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }

        const { error } = gameSchema.validate(req.body);
        if (error) {
          console.error("Validation échouée :", error.details);
        } else {
          console.log("Validation réussie !");
        }
        const newGame = await Game.create({
            title,
            description,
            genre,
            sub_genres,
            pegi,
            sensitive_content,
        });
        res.status(201).json({message:'Ajout du game:', data: newGame});

    }catch(error:any){
        if(error.code===11000){
            res.status(400).json({message: 'Ce game est déjà ajouter!'});
            return 
        }
        console.error("Erreur lors de la l'ajout du game : ", error);
        res.status(500).json({ message: "Erreur lors de la l'ajout du game" });
    }
}

export async function modifyGame(req: Request, res: Response) {
    try{
        
    }catch{

    }
}