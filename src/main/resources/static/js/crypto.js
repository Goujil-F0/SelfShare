/**
 * crypto.js - Moteur de chiffrement AES-GCM 256
 */

/**
 * Chiffre les données (texte ou fichier)
 */
async function encryptData(data, isFile = false) {
    // 1. Génération d'une clé aléatoire de 256 bits
    const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    // 2. Génération de l'IV (Vecteur d'Initialisation)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 3. Préparer les données
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

    // 5. Export de la clé
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);

    return {
        content: bufferToBase64(encryptedBuffer),
        iv: bufferToBase64(iv),
        key: bufferToBase64(exportedKey)
    };
}

/**
 * Déchiffre les données (Appelé par view.html)
 */
async function decryptData(encryptedBase64, keyBase64, ivBase64, isFile = false) {
    const encryptedBuffer = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));

    const key = await window.crypto.subtle.importKey(
        "raw", keyBuffer, "AES-GCM", true, ["decrypt"]
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedBuffer
    );

    if (isFile) {
        // Retourne un Blob URL pour le téléchargement
        const blob = new Blob([decryptedBuffer]);
        return URL.createObjectURL(blob);
    } else {
        // Retourne le texte décodé
        return new TextDecoder().decode(decryptedBuffer);
    }
}

/**
 * Transforme un binaire en Base64 (Version Robuste)
 * On utilise une boucle au lieu de '...' pour éviter le crash sur gros fichiers
 */
function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}