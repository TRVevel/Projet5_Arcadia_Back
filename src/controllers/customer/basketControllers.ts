import { Request, Response } from 'express';
import Basket from '../../models/basket.model';
import GamePlatform from '../../models/game_platforms.model';
import sequelize from '../../config/database';
import Order from '../../models/order.model';
import OrderGamePlatform from '../../models/order_game_platform.model';
import Customer from '../../models/customer.model';


export async function getCustomerBaskets(req: Request, res: Response) {
    const customer_id = req.user?.id;
    try{

        const baskets = await Basket.findAll({ where: { customer_id } });

        if (baskets.length === 0) {
            res.status(404).json({ message: "Aucune commande trouvée pour ce client" });
            return;
        }

        res.status(200).json(baskets);
        return;
    } catch (err: any) {
        console.error("Erreur lors de la récupération des commandes :", err);
        res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
        return;
    }
}

export async function createBasket (req: Request, res: Response) {
    const customer_id = req.user?.id;
    const {game_platform_id, quantity} = await req.body;
    try{
        if (!customer_id || !game_platform_id || !quantity) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }

        const gamePlatform = await GamePlatform.findByPk(game_platform_id);
        if(!gamePlatform){
            res.status(404).json({message: 'Platform non trouvée'});
            return;
        }
        const total_price = gamePlatform.price * quantity;
        const newBasket = await Basket.create({
            customer_id,
            game_platform_id,
            quantity,
            total_price
        });

        res.status(201).json({message:'Ajout du panier:', data: newBasket});

    }catch(error:any){
        if(error.code===11000){
            res.status(400).json({message: 'Ce panier est déjà ajouter!'});
            return 
        }
        console.error("Erreur lors de l'ajout du panier : ", error);
        res.status(500).json({ message: "Erreur lors de l'ajout du panier" });
    }
}

export async function modifyBasket(req: Request, res: Response) {
    const {quantity} = await req.body;
    const {id} = await req.params;
    try{
        if ( !quantity) {
            res.status(400).json({ message: 'Vous devez taper une quantité' });
            return;
        }
        const basket = await Basket.findByPk(id);
        if(!basket){
            res.status(404).json({message: 'Panier non trouvé'});
            return;
        }
        const gamePlatform = await GamePlatform.findByPk(typeof basket.game_platform_id === 'number' ? basket.game_platform_id : basket.game_platform_id[0]);
        if(!gamePlatform){
            res.status(404).json({message: 'Platform non trouvée'});
            return;
        }
        const total_price = gamePlatform.price * quantity;
        await basket.update({
            quantity,
            total_price
        });
        res.status(200).json({message: 'Panier modifié avec succès', data: basket});
    }catch(error:any){
        console.error("Erreur lors de la modification du panier : ", error);
        res.status(500).json({ message: "Erreur lors de la modification du panier "});
    }
}

export async function deleteBasket(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        if (!id) {
            res.status(400).json({ message: "Vous devez fournir un ID de panier" });
            return;
        }

        // Récupérer le panier par son ID
        const basket = await Basket.findByPk(id);
        if (!basket) {
            res.status(404).json({ message: "Panier non trouvé" });
            return;
        }
        await basket.destroy({ force: true
        });
        res.status(200).json({ message: "Panier retiré avec succès" });
    } catch (err: any) {
        console.error('Erreur lors de la suppression du panier : ', err)
        res.status(500).json({ message: 'Erreur lors de la suppression du panier' })
    }
}


export async function confirmBasket(req: Request, res: Response) {
    // Récupérer l'ID du client depuis le token
    const customer_id = req.user?.id;

    if (!customer_id) {
        res.status(401).json({ message: "Utilisateur non authentifié" });
        return;
    }

    try {
        // Récupérer tous les paniers du client
        const baskets = await Basket.findAll({ where: { customer_id } });

        if (baskets.length === 0) {
            res.status(404).json({ message: "Aucun panier trouvé pour ce client" });
            return;
        }

        let totalPrice = 0;
        const gameInfoToUpdate: GamePlatform[] = [];

        // Vérification des stocks et calcul du prix total
        for (const basket of baskets) {
            const gamePlatform = await GamePlatform.findByPk(basket.game_platform_id);

            if (!gamePlatform) {
                res.status(404).json({ message: `Produit introuvable: ${basket.game_platform_id}` });
                return;
            }

            if (gamePlatform.stock < basket.quantity) {
                res.status(400).json({ message: `Stock insuffisant pour le produit: ${basket.game_platform_id} (Stock: ${gamePlatform.stock}, Requis: ${basket.quantity})` });
                return;
            }

            totalPrice += gamePlatform.price * basket.quantity;

            // Mise à jour du stock
            gamePlatform.stock -= basket.quantity;
            gameInfoToUpdate.push(gamePlatform);
        }
        const customer= await Customer.findByPk(customer_id, { attributes: ['adress'] });
        if (!customer) {
            res.status(404).json({ message: "Adresse introuvable" });
            return;
        }
        // Création de la commande dans une transaction
        const newOrder = await sequelize.transaction(async (t) => {
            const order = await Order.create({ customer_id, adress:customer.adress, total_price: totalPrice }, { transaction: t });

            // Associer chaque produit à la commande
            await Promise.all(
                baskets.map((basket) =>
                    OrderGamePlatform.create(
                        {
                            order_id: order.id,
                            game_platform_id: basket.game_platform_id,
                            quantity: basket.quantity,
                        },
                        { transaction: t }
                    )
                )
            );

            // Mise à jour des stocks
            await Promise.all(gameInfoToUpdate.map((gameInfo) => gameInfo.save({ transaction: t })));

            // Supprimer les paniers après validation de la commande
            await Basket.destroy({ where: { customer_id }, transaction: t });

            return order;
        });
        
        const customerTable = await Customer.findByPk(customer_id);
      
      if (!customerTable) {
        res.status(404).send("Customer pas trouver");
        return;
      }
      customerTable.order_history.push(newOrder.id as number);
        await customerTable.save();

        res.status(201).json({ message: "Commande confirmée avec succès", data: newOrder });
        return;
    } catch (error: any) {
        console.error("Erreur lors de la confirmation du panier :", error);
        res.status(500).json({ message: "Erreur lors de la confirmation du panier" });
        return;
    }
}



