class Profil {
    constructor() {
        this.confirmForm()
    }
    getUserIdFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.id;
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
            return null;
        }
    }
    async sendProfile(updateProfil) {
        const userId = this.getUserIdFromToken()
        const token = localStorage.getItem("token");
        if (!userId) {
            console.error("Aucun utilisateur trouvé. Veuillez vous connecter.");
            return;
        }
        console.log("le token ",token)
        try {
            const response = await fetch(`http://localhost:3001/updateUser/${userId}`, {
                method: "PATCH",
                headers: {"Authorization": `Bearer ${token}`,
                },
                body: updateProfil
            });
            const responseData = await response.json();
            console.log("Réponse complète du serveur :", responseData);

            return response.status;

        } catch (err) {
            console.error('Erreur lors de la modification du profil');
            return 500;
        }
    }
    confirmForm = () => {
        const form = document.querySelector("form");
        if (!form) {
            console.error("Formulaire non trouvé !");
            return;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

                const name = document.getElementById("name").value;
                const lastname = document.getElementById("lastname").value;
                const mail = document.getElementById("mail").value;
                const password = document.getElementById("password").value;
                const confirmPassword = document.getElementById("confirmPassword").value;
                const username = document.getElementById("username").value;
                const dob = document.getElementById("dob").value;
                const avatarInput = document.getElementById("avatars");
                const avatarFile = avatarInput.files[0];

                if (password === !confirmPassword) {
                    alert("Les 2 mot de passes ne sont pas identiques !");
                }

                const updateProfil = new FormData();
                updateProfil.append("username", username);
                updateProfil.append("lastname", lastname);
                updateProfil.append("name", name);
                updateProfil.append("mail", mail);
                updateProfil.append("password", password);
                updateProfil.append("dob", dob);
                updateProfil.append("avatars", avatarInput.files[0]);

                if (avatarFile) {
                    updateProfil.append("avatars", avatarFile);
                }

                console.log("🔹 Données envoyées au backend :");
                for (let [key, value] of updateProfil.entries()) {
                    console.log(`${key}:`, value);
                }

                const status = await this.sendProfile(updateProfil);

                console.log("le status", status)
                if (status === 200) {
                    alert("Modification du profil reussi !");
                    window.location.href = "../public/Index.html";
                } else {
                    alert("Erreur lors de la modification du profil");
                }
        })
    }
}

const profil = new Profil();