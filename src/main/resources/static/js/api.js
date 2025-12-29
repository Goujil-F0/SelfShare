/**
 * js/api.js
 * Le rôle de ce fichier est de gérer toutes les requêtes vers le serveur Spring Boot.
 */

const API_BASE_URL = '/api/secrets';

const ApiService = {

    /**
     * Envoie le secret chiffré au serveur.
     * @param {Object} payload - Contient content_blob, iv, is_file, expires_at
     */
    async postSecret(payload) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Erreur serveur lors de l'enregistrement du secret");
        }

        return await response.json(); // Retourne l'objet contenant l'ID (UUID)
    },

    /**
     * Récupère un secret chiffré depuis le serveur par son ID.
     * Utilisé par le Membre D pour la page view.html
     */
    async getSecret(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            if (response.status === 404) throw new Error("Secret introuvable ou déjà supprimé.");
            throw new Error("Erreur lors de la récupération du secret.");
        }

        return await response.json(); // Retourne le content_blob et l'iv
    }
};