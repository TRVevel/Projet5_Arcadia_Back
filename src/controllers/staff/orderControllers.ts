import { Request, Response } from "express";
import Order from "../../models/order.model";
import GamePlatform from "../../models/game_platforms.model";
import Game from "../../models/game.model";
import OrderGamePlatform from "../../models/order_game_platform.model";
import sequelize from "../../config/database";
import Customer from "../../models/customer.model";

// Récupérer toutes les commandes
export async function getAllOrders(req: Request, res: Response) {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur lors de la récupération des orders' });
    }
}

// Récupérer les commandes d'un client spécifique
export async function listOrdersByCustomer(req: Request, res: Response) {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            res.status(404).json({ message: "Ce client n'existe pas !" });
            return;
        }
        const orders = await Order.findAll({ where: { customer_id: customerId } });
        res.status(200).json({
            message: `Le client Id = '${customerId}' nom = '${customer.first_name} ${customer.last_name}' a passé ${orders.length} commandes.`,
            data: orders
        });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

// Créer une commande
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

            totalPrice += Number(gameInfo.price) * quantity;
            gameInfo.stock -= quantity;
            gameInfoToUpdate.push(gameInfo);
        }

        const customer = await Customer.findByPk(customer_id, { attributes: ['adress'] });
        if (!customer) {
            res.status(404).json({ message: "Adresse introuvable" });
            return;
        }

        // Création de la commande dans une transaction
        const newOrder = await sequelize.transaction(async (t) => {
            const order = await Order.create(
                { customer_id, adress: customer.adress, total_price: totalPrice },
                { transaction: t }
            );

            await Promise.all(
                game_platform_id_list.map(({ game_platform_id, quantity }) =>
                    OrderGamePlatform.create(
                        {
                            order_id: order.id,
                            game_platform_id,
                            quantity,
                        },
                        { transaction: t }
                    )
                )
            );

            await Promise.all(gameInfoToUpdate.map((gameInfo) => gameInfo.save({ transaction: t })));

            return order;
        });

        // Mise à jour de l'historique de commandes du client
        const customerTable = await Customer.findByPk(customer_id);
        if (!customerTable) {
            res.status(404).json({ message: "Customer pas trouvé" });
            return;
        }
        if (!Array.isArray(customerTable.order_history)) {
            customerTable.order_history = [];
        }
        customerTable.order_history = [...customerTable.order_history, newOrder.id as number];
        try {
            await customerTable.save();
        } catch (e: any) {
            // On log uniquement en interne, pas de fuite côté client
        }

        res.status(201).json({ message: 'Commande créée avec succès', data: newOrder });
    } catch (error: any) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la commande" });
    }
}

// Modifier le statut d'une commande
export const modifyOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "ID invalide" });
            return;
        }
        const order = await Order.findByPk(id);
        if (!order) {
            res.status(404).json({ message: "Commande non trouvée" });
            return;
        }
        if (order.status === 'cancelled') {
            res.status(400).json({ message: `Impossible, la commande est : ${order.status}` });
            return;
        } else if (order.status === 'delivered') {
            res.status(400).json({ message: `La commande est déjà : ${order.status}` });
            return;
        } else if (order.status === 'shipped') {
            order.status = "delivered";
        } else if (order.status === 'pending') {
            order.status = "shipped";
        }

        await order.save();

        res.status(200).json({ message: "La commande est passée à l'étape suivante avec succès", data: order });
    } catch (err: any) {
        res.status(500).json({ message: "Une erreur est survenue lors de la modification de la commande" });
    }
};

