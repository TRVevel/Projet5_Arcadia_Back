import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { syncDatabase } from './models/syncModels';
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express'
import authRoutes from "./routes/authRoutes";
//Création d'un serveur Express
const app = express();
dotenv.config();
//Définition du port du serveur
const PORT = 3000;
console.log("Lancement du serveur D'Arcadia")
//Config du serveur par défaut
app.use(express.json());
// Connecter à Sequelize
testConnection().then(() => syncDatabase());
//Définition des routes
app.use('/api/auth', authRoutes);
//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(PORT, () => {
console.log(`Le serveur est lancé ici http://localhost:${PORT}`);
});