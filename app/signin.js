class Signin {
    constructor() {
        this.confirmPassword(); // Ajout ici pour que la validation fonctionne dès le chargement
    }

    confirmPassword = () => {
        const form = document.querySelector("form");
        if (!form) {
            console.error("Formulaire non trouvé !");
            return;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Empêche l'envoi automatique du formulaire

            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm_password").value;
            const username = document.getElementById("username").value;
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const lastname = document.getElementById("lastname").value;



            if (password !== confirmPassword) {
                alert("Les mots de passe ne correspondent pas !");
                return; // Stoppe la fonction si les mots de passe ne sont pas identiques
            }

            // Création de l'objet utilisateur
            const userData = {
                username: username,
                lastname: lastname,
                name: name,
                email: email,
                password: password
            };

            console.log("Données envoyées au backend :", userData); // Vérifier les données envoyées

            // Envoi des données au backend
            const status = await this.insert(userData);

            if (status === 201) {
                alert("Compte créé avec succès !");
                window.location.href = "../public/index.html"; // Redirection après succès
            } else {
                alert("Erreur lors de l'inscription. Veuillez réessayer.");
            }
        });
    };

    async insert(userData) {
        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json();
            console.log("Réponse complète du serveur :", responseData);

            return response.status;
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            return 500;
        }
    }
}

const signin = new Signin();
