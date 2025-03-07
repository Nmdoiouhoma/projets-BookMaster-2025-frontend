async function resetPasswordAndRedirect() {
    // Attente que le DOM soit complètement chargé
    document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);

        const token = document.cookie.split(';').find(cookie => cookie.startsWith('resetToken=')).split('=')[1];

        if (!token) {
            alert("Token manquant ou invalide.");
            return;
        }

        // Affichage du formulaire de réinitialisation
        document.getElementById("resetPasswordContainer").style.display = "block";

        // Gestion de la soumission du formulaire de réinitialisation
        const form = document.getElementById("resetPassword");
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const newPassword = document.getElementById("newPassword").value;

            // Validation basique du mot de passe (minimum 8 caractères par exemple)
            if (newPassword.length < 8) {
                alert("Le mot de passe doit comporter au moins 8 caractères.");
                return;
            }

            // Requête pour réinitialiser le mot de passe
            fetch(`http://localhost:3000/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: newPassword })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Mot de passe réinitialisé avec succès.") {
                        alert("Votre mot de passe a été réinitialisé avec succès.");
                        window.location.href = "../public/login.html";  // Redirection vers la page de connexion
                    } else {
                        alert("Une erreur est survenue.");
                    }
                })
                .catch(error => {
                    alert("Erreur lors de la réinitialisation du mot de passe.");
                });
        });
    });
}

// Appel de la fonction dès que la page est chargée
resetPasswordAndRedirect();
