class Profil {
    constructor() {
        this.updateProfile()
    }

    getUserIdFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Décodage du token JWT
            return payload.id; // L'ID est stocké dans le payload du token
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
            return null;
        }
    }

    async updateProfile() {
        const name = document.getElementById("name").value;
        const lastname = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const username = document.getElementById("username").value;
        const dob = document.getElementById("dob").value;

        const avatarInput = document.getElementById("avatars");
        const avatarFile = avatarInput.files[0];

        if(password ===! confirmPassword){
            alert("Les 2 mot de passes ne sont pas identiques !");
        }

        const updateProfil = new FormData();
        updateProfil.append("username", username);
        updateProfil.append("lastname", lastname);
        updateProfil.append("name", name);
        updateProfil.append("email", email);
        updateProfil.append("password", password);
        updateProfil.append("dob", dob);
        updateProfil.append("avatar", avatarInput.files[0]);

        if (avatarFile) {
            updateProfil.append("avatar", avatarFile);
        }

        console.log("🔹 Données envoyées au backend :");
        for (let [key, value] of updateProfil.entries()) {
            console.log(`${key}:`, value);
        }

        const status = await this.sendProfile(updateProfil);

        if (status === 201) {
            alert("Modification du profil reussi !");
        } else {
            alert("Erreur lors de la modification du profil");
        }
}

   async sendProfile(updateProfil) {
        const userId = this.getUserIdFromToken()
        try {
           const response = await fetch(`http://localhost:3001/updateProfil/${userId}`, {
               method: "POST",
               body: updateProfil
           });
            const responseData = await response.json();
            console.log("Réponse complète du serveur :", responseData);

            return response.status;

        }catch(err){
            console.error('Erreur lors de la modification du profil');
            return 500;
        }
    }
}

const profil = new Profil();