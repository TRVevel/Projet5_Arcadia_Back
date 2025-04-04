import { Request, Response } from "express";
import Order from "../../models/order.model";
import OrderGamePlatform from "../../models/order_game_platform.model";
import GamePlatform from "../../models/game_platforms.model";
import sequelize from "../../config/database";

export async function getCustomerOrders(req: Request, res: Response) {

    const customer_id = req.user?.id;
    try{

        const orders = await Order.findAll({ where: { customer_id } });

        if (orders.length === 0) {
            res.status(404).json({ message: "Aucune commande trouvée pour ce client" });
            return;
        }

        res.status(200).json(orders);
        return;
    } catch (err: any) {
        console.error("Erreur lors de la récupération des commandes :", err);
        res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
        return;
    }
}

export async function cancelMyOrder(req: Request, res: Response) {
    const customer_id = req.user?.id;
    const { order_id } = req.params; // Récupération de l'ID de la commande depuis l'URL

    try {
        // Récupérer la commande
        const order = await Order.findOne({ where: { id: order_id, customer_id } });

        if (!order) {
            res.status(404).json({ message: "Commande introuvable ou n'appartient pas à ce client" });
            return;
        }

        if (order.status !== "pending") {
            res.status(400).json({ message: "Impossible d'annuler cette commande car elle est déjà en cours ou terminée" });
            return;
        }

        // Démarrer une transaction pour annuler la commande proprement
        await sequelize.transaction(async (t) => {
            // Récupérer tous les produits de la commande
            const orderItems = await OrderGamePlatform.findAll({ where: { order_id }, transaction: t });

            // Rétablir les stocks
            for (const item of orderItems) {
                const gamePlatform = await GamePlatform.findByPk(item.game_platform_id, { transaction: t });

                if (gamePlatform) {
                    gamePlatform.stock += item.quantity;
                    await gamePlatform.save({ transaction: t });
                }
            }

            // Supprimer les produits liés à la commande
            await OrderGamePlatform.destroy({ where: { order_id }, transaction: t });

            // Supprimer la commande elle-même
            await Order.destroy({ where: { id: order_id }, transaction: t });
        });

        res.status(200).json({ message: "Commande annulée avec succès" });
        return;
    } catch (err: any) {
        console.error("Erreur lors de l'annulation de la commande :", err);
        res.status(500).json({ message: "Erreur lors de l'annulation de la commande" });
        return;
    }
}