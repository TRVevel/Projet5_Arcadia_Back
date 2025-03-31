import { Request, Response } from 'express';
import Basket from '../../models/basket.model';
import GamePlatform from '../../models/game_platforms.model';
import sequelize from '../../config/database';
import Order from '../../models/order.model';
import OrderGamePlatform from '../../models/order_game_platform.model';


export async function getAllBaskets(req: Request, res: Response) {
    try {
        const baskets = await Basket.findAll();
        res.status(200).json(baskets);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des baskets : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des baskets' })
        
    }
}
