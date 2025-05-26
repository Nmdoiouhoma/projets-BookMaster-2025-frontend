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
            const dob = document.getElementById("dob").value;
            const avatarInput = document.getElementById("avatars");
            const avatarFile = avatarInput.files[0];

            if (password !== confirmPassword) {
                alert("Les mots de passe ne correspondent pas !");
                return;
            }

            // Création de FormData pour envoyer le fichier correctement
            const formData = new FormData();
            formData.append("username", username);
            formData.append("lastname", lastname);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("dob", dob);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            console.log("🔹 Données envoyées au backend :");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const status = await this.insert(formData);

            if (status === 201) {
                alert("Compte créé avec succès !");
                window.location.href = "../public/Index.html";
            } else {
                alert("Erreur lors de l'inscription. Veuillez réessayer.");
            }
        });
    };

    async insert(formData) {
        try {
            const response = await fetch("http://localhost:3001/signup", {
                method: "POST",
                body: formData
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

const signin = new  Signin();
