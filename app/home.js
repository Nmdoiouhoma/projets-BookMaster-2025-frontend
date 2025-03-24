document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});

function checkAuth() {
    const token = localStorage.getItem("token");
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    if (!token) {
        console.log('Erreur de connexion : Aucun token trouvé');
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Décoder le token JWT
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

        if (payload.exp < currentTime) { // Correction de la condition
            console.log('Erreur de connexion : Le token est expiré');
            localStorage.removeItem("token");
            return;
        }
    if(payload.username){
        alert(`Bienvenue dans le site Bookmaster ${payload.username} ! 🎉`);
    }
    else{
        console.warn("Erreur nom d'utilisateur non trouvé dans le token")
    }
        console.log('Token valide, utilisateur connecté');
        if (loginButton) loginButton.style.display = "none";
        if (signupButton) signupButton.style.display = "none";


    } catch (error) {
        console.log('Erreur lors du décodage du token, suppression et redirection');
        localStorage.removeItem("token");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    let originalTexts = new Map(); // Stocke le texte original des éléments

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();

        if (query === "") {
            resetHighlighting();
            return;
        }

        const regex = new RegExp(query, "gi");
        const elements = document.querySelectorAll("h1, h2, h3, h4, p, span");
        let found = false;

        elements.forEach(element => {
            // Sauvegarde le texte original si ce n'est pas déjà fait
            if (!originalTexts.has(element)) {
                originalTexts.set(element, element.textContent);
            }

            // Remplace uniquement le texte original, sans toucher aux balises HTML existantes
            const originalText = originalTexts.get(element);
            const highlightedText = originalText.replace(regex, match => {
                found = true;
                return `<span class="highlight">${match}</span>`;
            });

            element.innerHTML = highlightedText; // Met à jour le contenu
        });

        if (!found) {
            alert("Aucun résultat trouvé !");
        }
    });

    function resetHighlighting() {
        originalTexts.forEach((text, element) => {
            element.textContent = text; // Restaure le texte original
        });
        originalTexts.clear(); // Vide la mémoire
    }
});
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); // Bloque l'envoi du formulaire
});



