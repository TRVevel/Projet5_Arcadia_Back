import { Request, Response } from 'express';
import Basket from '../../models/basket.model';

export async function getAllBaskets(req: Request, res: Response) {
    try {
        const baskets = await Basket.findAll();
        res.status(200).json(baskets);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur lors de la récupération des baskets' });
    }
}
