import { Request, Response } from "express";
import Order from "../../models/order.model";
import GamePlatform from "../../models/game_platforms.model";
import Game from "../../models/game.model";
import OrderGamePlatform from "../../models/order_game_platform.model";
import sequelize from "../../config/database";
import Customer from "../../models/customer.model";

export async function getAllOrders(req: Request, res: Response) {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des orders : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des orders' })
        
    }
}
export async function listOrdersByCustomer(req: Request, res: Response) {
    try {
        const { customerId } = req.params;

        // Vérification de l'existence du client
        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            res.status(404).json({ message: "ATTENTION : Ce client n'existe pas !" });
            return;
        }

        // Récupération des commandes du client
        const orders = await Order.findAll({ where: { customer_id: customerId } });
        console.log(orders);
        
        res.status(200).json({ message: "le client Id = '" + customerId + "' nom = '" + customer.first_name + " "+  customer.last_name + "' a passé " + orders.length + " commandes qui sont :", data: orders });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

export async function createOrder(req: Request, res: Response) {
    const { customer_id, game_platform_id_list } = req.body;

    if (!customer_id || !game_platform_id_list || !Array.isArray(game_platform_id_list) || game_platform_id_list.length === 0) {
        res.status(400).json({ message: "Tous les champs sont requis et game_platform_id_list doit être un tableau valide" });
        return;
    }

    try {
        let totalPrice = 0;
        const gameInfoToUpdate: GamePlatform[] = [];

        // Vérification de chaque produit
        for (const { game_platform_id, quantity } of game_platform_id_list) {
            const gameInfo = await GamePlatform.findByPk(game_platform_id);

            if (!gameInfo) {
                res.status(404).json({ message: `Produit introuvable: ${game_platform_id}` });
                return;
            }

            if (gameInfo.stock < quantity) {
                res.status(400).json({ message: `Stock insuffisant pour le produit: ${game_platform_id} (Stock: ${gameInfo.stock}, Requis: ${quantity})` });
                return;
            }

            totalPrice += gameInfo.price * quantity;

            // Mise à jour du stock
            gameInfo.stock -= quantity;
            gameInfoToUpdate.push(gameInfo);
        }
        const customer= await Customer.findByPk(customer_id, { attributes: ['adress'] });
        if (!customer) {
            res.status(404).json({ message: "Adresse introuvable" });
            return;
        }
        // Création de la commande dans une transaction
        const newOrder = await sequelize.transaction(async (t) => {
            // Création de la commande
            const order = await Order.create({ customer_id, adress:customer.adress, total_price: totalPrice }, { transaction: t });

            // Associer chaque produit à la commande dans OrderGamePlatform
            await Promise.all(
                game_platform_id_list.map(({ game_platform_id, quantity }) =>
                    OrderGamePlatform.create(
                        {
                            order_id: order.id,
                            game_platform_id,
                            quantity, // Correctement utilisé
                        },
                        { transaction: t }
                    )
                )
            );

            // Mise à jour des stocks
            await Promise.all(gameInfoToUpdate.map((gameInfo) => gameInfo.save({ transaction: t })));

            return order;
        });

        const customerTable = await Customer.findByPk(customer_id);
      
      if (!customerTable) {
        res.status(404).send("Customer pas trouver");
        return;
      }
      customerTable.order_history.push(newOrder.id as number);
        await customerTable.save();
        res.status(201).json({ message: 'Commande créée avec succès', data: newOrder });
        return;
    } catch (error: any) {
        console.error("Erreur lors de l'ajout de la commande :", error);
        res.status(500).json({ message: "Erreur lors de l'ajout de la commande" });
        return;
    }
}

export const modifyOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("Invalid ID");
        return;
      }
      const order = await Order.findByPk(id);
      if (!order) {
        res.status(404).send("Order pas trouver");
        return;
      }
        if(order.status ==='cancelled'){
            res.status(400).json({ message: `Impossible la commande est : ${order.status}` });
            return;
        }else if(order.status ==='delivered'){
            res.status(400).json({ message: `La commande est déjà : ${order.status}` });
            return;
        }else if(order.status ==='shipped'){
            order.status = "delivered";
        }else if(order.status ==='pending'){
            order.status = "shipped";
        }
        
        await order.save();
  
        res.status(201).json({ message: 'Commande annulée avec succès', data: order });
      } catch (err) {
        res.status(500).send("Une erreur est survenue lors de la modification de la commande");
      }
    };

