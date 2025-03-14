import { Sequelize } from 'sequelize';

// Assure-toi d'ajouter 'dialect' explicitement ici
const sequelize = new Sequelize('Arcadia_DB', 'postgres', 'root', {
  host: 'localhost',  // Remplace par l'adresse de ton serveur si nécessaire
  dialect: 'postgres', // Spécifie le dialecte (postgres pour PostgreSQL)
  logging: false, // Pour désactiver les logs SQL, tu peux le mettre à true pour voir les requêtes
});

// Fonction pour tester la connexion
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connecté à PostgreSQL avec Sequelize");
  } catch (error) {
    console.error("Erreur de connexion à PostgreSQL :", error);
  }
};

export default sequelize;
