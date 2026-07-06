const API_BASE_URL = '/api/secrets';

const ApiService = {
    async postSecret(payload) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Erreur serveur lors de l'enregistrement du secret.");
        }

        return await response.json();
    },

    async revealSecret(id) {
        const response = await fetch(`${API_BASE_URL}/${id}/reveal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Secret introuvable ou deja supprime.");
            }
            throw new Error("Erreur lors de la recuperation du secret.");
        }

        return await response.json();
    }
};
