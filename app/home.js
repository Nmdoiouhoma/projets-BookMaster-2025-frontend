document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});

async function checkAuth() {
    const token = localStorage.getItem("token");
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    if (!token) {
        console.log('🚫 Aucun token trouvé, utilisateur non connecté.');
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/user/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Utilisateur non authentifié");
        }

        const user = await response.json();
        console.log("✅ Utilisateur connecté :", user);

        alert(`Bienvenue sur Bookmaster, ${user.username} ! 🎉`);

        if (loginButton) loginButton.style.display = "none";
        if (signupButton) signupButton.style.display = "none";

    } catch (error) {
        console.error("⚠️ Erreur d'authentification :", error);
        localStorage.removeItem("token");//Supprime le token si invalide
        window.location.href="../public/login.html"
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



