/**
 * main.js - Le chef d'orchestre du Frontend (Version Cyber-Compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
    const encryptBtn = document.getElementById('encryptBtn');
    const copyBtn = document.getElementById('copyBtn');

    // --- ÉTAPE 1 : CLIC SUR LE BOUTON GÉNÉRER ---
    if (encryptBtn) {
        encryptBtn.addEventListener('click', async () => {
            const text = document.getElementById('textInput').value;
            const fileInput = document.getElementById('fileInput');
            const file = fileInput ? fileInput.files[0] : null;
            const expirySeconds = document.getElementById('expirySelect').value;

            // Validation
            if (!text && !file) {
                alert("ERR: INPUT_REQUIRED // Saisir un message ou un fichier.");
                return;
            }

            // Style Cyber : Bouton en mode "Processing"
            encryptBtn.innerText = "EXECUTING_ENCRYPTION...";
            encryptBtn.disabled = true;

            try {
                // --- ÉTAPE 2 : CHIFFREMENT ---
                const dataToEncrypt = file || text;
                const isFile = !!file;

                const cryptoResult = await encryptData(dataToEncrypt, isFile);

                // --- ÉTAPE 3 : PRÉPARATION DU PAQUET (JSON) ---
                // On formate exactement pour l'entité Secret.java
                const payload = {
                    contentBlob: cryptoResult.content,
                    iv: cryptoResult.iv,
                    filename: isFile ? file.name : null,
                    file: isFile,
                    expiresAt: calculateExpiryDate(expirySeconds), // Fonction corrigée en bas
                    senderEmail: ""
                };

                // --- ÉTAPE 4 : ENVOI AU SERVEUR ---
                const serverResponse = await ApiService.postSecret(payload);

                // --- ÉTAPE 5 : CONSTRUCTION DU LIEN ---
                const generatedId = serverResponse.id;
                const encryptionKey = cryptoResult.key;
                const finalLink = `${window.location.origin}/view.html?id=${generatedId}#${encryptionKey}`;

                // --- ÉTAPE 6 : AFFICHAGE DU RÉSULTAT ---
                showResultView(finalLink, generatedId);

            } catch (error) {
                console.error("Critical Error:", error);
                alert("SYSTEM_FAILURE: " + error.message);
                encryptBtn.innerText = "INITIATE ENCRYPTION 🔒";
                encryptBtn.disabled = false;
            }
        });
    }

    // --- BOUTON COPIER ---
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const shareUrlInput = document.getElementById('shareUrl');
            shareUrlInput.select();
            navigator.clipboard.writeText(shareUrlInput.value);

            copyBtn.innerText = "COPIED_TO_CLIPBOARD";
            setTimeout(() => {
                copyBtn.innerText = "COPY TO CLIPBOARD";
            }, 2000);
        });
    }
});

/**
 * Calcule la date d'expiration
 * CORRECTION : Utilise les secondes et formate pour LocalDateTime (sans le 'Z')
 */
function calculateExpiryDate(seconds) {
    if (seconds == 0 || seconds == "0") return null;

    const date = new Date();
    // vault.html envoie des secondes (3600, 86400), donc on utilise setSeconds
    date.setSeconds(date.getSeconds() + parseInt(seconds));

    // Format requis par Java LocalDateTime : YYYY-MM-DDTHH:mm:ss
    // On retire les millisecondes et le 'Z' (UTC) qui font planter le serveur
    return date.toISOString().split('.')[0];
}

/**
 * Bascule l'affichage vers le résultat (Style Cyber)
 */
function showResultView(link, secretId) {
    const stepForm = document.getElementById('step-form');
    const stepResult = document.getElementById('step-result');

    if (stepForm && stepResult) {
        stepForm.style.display = 'none';
        stepResult.style.display = 'block';
        document.getElementById('shareUrl').value = link;

        const qrImg = document.getElementById('qr-code-img');
        const qrContainer = document.getElementById('qr-code-container');

        if (qrImg && qrContainer) {
            // Appel à l'API QR Code du serveur
            qrImg.src = `/api/secrets/qr?link=${encodeURIComponent(link)}`;
            qrContainer.style.display = 'block';
        }
    }
}