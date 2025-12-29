/**
 * Pourquoi AES-GCM ? C'est le standard actuel. Il garantit non seulement
 * la confidentialité mais aussi l'intégrité (on ne peut pas modifier le message).
 */

async function encryptData(data, isFile = false) {
    // 1. Génération d'une clé aléatoire de 256 bits
    const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    // 2. Génération de l'IV (Vecteur d'Initialisation)
    // Indispensable pour que le même texte ne donne pas le même résultat chiffré
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 3. Préparer les données (convertir texte/fichier en octets)
    let encodedData;
    if (isFile) {
        encodedData = await data.arrayBuffer();
    } else {
        encodedData = new TextEncoder().encode(data);
    }

    // 4. Chiffrement effectif
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedData
    );

    // 5. Export de la clé en format "raw" pour le lien URL
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);

    return {
        content: bufferToBase64(encryptedBuffer),
        iv: bufferToBase64(iv),
        key: bufferToBase64(exportedKey)
    };
}

// Fonction utilitaire pour transformer du binaire en texte (Base64)
function bufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}