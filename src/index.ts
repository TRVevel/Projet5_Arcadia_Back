import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { syncDatabase } from './models/syncModels';
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import authRoutes from "./routes/authRoutes";
import staffRoutes from "./routes/staffRoutes";
import customerRoutes from "./routes/customerRoutes";
import gameRoutes from "./routes/gameRoutes";
import platformRoutes from "./routes/platformRoutes";
import game_platformsRoutes from "./routes/game_platformsRoutes";
import basketRoutes from "./routes/basketRoutes";
import orderRoutes from "./routes/orderRoutes";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
//Création d'un serveur Express
const app = express();

app.use(cookieParser());

dotenv.config();
//Définition du port du serveur
console.log("Lancement du serveur D'Arcadia")
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200', // URL de votre client Angular
    methods: 'GET,POST,DELETE,PUT', // Restreindre les méthodes autorisées
    credentials: true // si tu utilises des cookies ou des headers auth
}));
//Config du serveur par défaut
app.use(express.json());
// Connecter à Sequelize
testConnection().then(() => syncDatabase());

(async function() {

    // Configuration de Cloudinary
    cloudinary.config({ 
        cloud_name: 'degh1iotq', 
        api_key: process.env.CLOUDINARY_PK, 
        api_secret: process.env.CLOUDINARY_SK 
    });
      
})();
// Middleware de rate limiting
export const apiLimiter = rateLimit({
windowMs: 15 * 60 * 1000, // ⏳ temps en millisecondes
max: 100, // 🔒 Limite à 100 requêtes par IP
message: "⛔ Trop de requêtes. Réessayez plus tard."
});
// Appliquer le rate limiter sur toutes les routes
app.use(apiLimiter);
app.use(
helmet({
contentSecurityPolicy: {
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'", "'nonce-random123'"],
styleSrc: ["'self'"], // Supprimer 'strict-dynamic'
imgSrc: ["'self'"], // Supprimer 'data:'
objectSrc: ["'none'"],
baseUri: ["'self'"],
formAction: ["'self'"],
frameAncestors: ["'none'"],
scriptSrcAttr: ["'none'"],
upgradeInsecureRequests: [],
},
},
})
)
//Définition des routes
app.use('/api/auth', authRoutes);
app.use('/api', staffRoutes);
app.use('/api', customerRoutes);
app.use('/api', gameRoutes);
app.use('/api', platformRoutes);
app.use('/api', game_platformsRoutes);
app.use('/api', basketRoutes);
app.use('/api', orderRoutes);
//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(process.env.PORT, () => {
console.log(`Le serveur est lancé ici http://localhost:${process.env.PORT || 3000}`);
});