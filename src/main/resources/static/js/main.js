/**
 * main.js - Le chef d'orchestre du Frontend
 */

document.addEventListener('DOMContentLoaded', () => {
    const encryptBtn = document.getElementById('encryptBtn');
    const copyBtn = document.getElementById('copyBtn');

    // --- ÉTAPE 1 : CLIC SUR LE BOUTON GÉNÉRER ---
    encryptBtn.addEventListener('click', async () => {
        const text = document.getElementById('textInput').value;
        const file = document.getElementById('fileInput').files[0];
        const expiryHours = document.getElementById('expirySelect').value;

        // Validation : il faut au moins un texte ou un fichier
        if (!text && !file) {
            alert("Veuillez saisir un message ou choisir un fichier.");
            return;
        }

        // Changement d'état du bouton (pour faire pro)
        encryptBtn.innerText = "Sécurisation en cours...";
        encryptBtn.disabled = true;

        try {
            // --- ÉTAPE 2 : CHIFFREMENT (Appel à crypto.js) ---
            const dataToEncrypt = file || text;
            const isFile = !!file;

            // On récupère le contenu chiffré, l'IV et la CLÉ
            const cryptoResult = await encryptData(dataToEncrypt, isFile);

            // --- ÉTAPE 3 : PRÉPARATION DU PAQUET (JSON) ---
            // On respecte exactement les noms de l'entité Secret.java du Membre A
            const payload = {
                contentBlob: cryptoResult.content, // Le charabia en Base64
                iv: cryptoResult.iv,               // L'IV en Base64
                filename: isFile ? file.name : null,
                file: isFile,                      // Correspond à isFile en Java
                expiresAt: calculateExpiryDate(expiryHours),
                senderEmail: null                  // Optionnel
            };

            // --- ÉTAPE 4 : ENVOI AU SERVEUR (Appel à api.js) ---
            const serverResponse = await ApiService.postSecret(payload);

            // --- ÉTAPE 5 : CONSTRUCTION DU LIEN UNIQUE ---
            // On récupère l'ID généré par PostgreSQL/MySQL
            // Et on ajoute la clé après le # (Zero-Knowledge !)
            const generatedId = serverResponse.id;
            const encryptionKey = cryptoResult.key;
            const finalLink = `${window.location.origin}/view.html?id=${generatedId}#${encryptionKey}`;

            // --- ÉTAPE 6 : AFFICHAGE DU RÉSULTAT ---
            showResultView(finalLink);

        } catch (error) {
            console.error("Erreur détaillée:", error);
            alert("Erreur technique : " + error.message);
            encryptBtn.innerText = "Verrouiller et partager";
            encryptBtn.disabled = false;
        }
    });

    // --- BOUTON COPIER ---
    copyBtn.addEventListener('click', () => {
        const shareUrlInput = document.getElementById('shareUrl');
        shareUrlInput.select();
        navigator.clipboard.writeText(shareUrlInput.value);

        copyBtn.innerText = "Copié !";
        copyBtn.style.background = "#22c55e"; // Vert
        setTimeout(() => {
            copyBtn.innerText = "Copier le lien";
            copyBtn.style.background = "#232b36"; // Retour couleur initiale
        }, 2000);
    });
});

/**
 * Calcule la date d'expiration au format ISO
 */
function calculateExpiryDate(hours) {
    if (hours == 0) return null; // Cas "Destruction immédiate"
    const now = new Date();
    now.setHours(now.getHours() + parseInt(hours));
    return now.toISOString();
}

/**
 * Bascule l'affichage du formulaire vers le résultat
 */
function showResultView(link) {
    document.getElementById('step-form').style.display = 'none';
    const resultDiv = document.getElementById('step-result');
    resultDiv.style.display = 'block';
    document.getElementById('shareUrl').value = link;
}