class Login {
    constructor() {
        this.handleLogin();
    }

    handleLogin = () => {
        const form = document.querySelector("form");
        if (!form) {
            console.error("Formulaire non trouvé !");
            return;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // Création de l'objet de connexion
            const loginData = {
                username: username,
                password: password,
            };

            console.log("Données envoyées au backend :", loginData);

            // Envoi des données au backend
            const status = await this.authenticate(loginData);

            if (status === 200) {
                alert("Connexion réussie !");
                window.location.href = "../public/index.html"; // Redirection après succès
            } else {
                alert("Échec de la connexion. Vérifiez vos identifiants et réessayez.");
            }
        });
    };

    async authenticate(loginData) {
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const responseData = await response.json();

            if(responseData){
                console.log("Réponse complète du serveur :", responseData);
                localStorage.setItem("token", responseData.token);
            }

            return response.status;
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            return 500;
        }
    }
}

const login = new Login();
