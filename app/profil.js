class Profil {
    constructor() {
        this.printexistingInfo()
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
                const username = document.getElementById("username").value;
                const dob = document.getElementById("dob").value;
                const avatarInput = document.getElementById("avatar");
                const avatarFile = avatarInput.files[0];

                const formData = new FormData();
                formData.append("username", username);
                formData.append("lastname", lastname);
                formData.append("name", name);
                formData.append("mail", mail);
                formData.append("dob", dob);

                if (avatarFile) {
                    formData.append("avatar", avatarFile);
                }

                console.log("🔹 Données envoyées au backend :");
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }

                const status = await this.sendProfile(formData);

                console.log("le status", status)
                if (status === 200) {
                    alert("Modification du profil reussi !");
                    window.location.href = "../public/Index.html";
                } else {
                    alert("Erreur lors de la modification du profil");
                }
        })
    }
    async printexistingInfo() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3001/user/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = await response.json();

            document.getElementById("username").value = user.username || "";
            document.getElementById("lastname").value = user.lastname || "";
            document.getElementById("name").value = user.name || "";
            document.getElementById("mail").value = user.email || "";
            document.getElementById("dob").value = user.date || "";

            console.log("Réponse complète du serveur :", user);
            return response.status;

        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return 500;
        }
    }
}
const profil = new Profil()