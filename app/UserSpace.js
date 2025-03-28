class UserSpace {

    constructor() {
        this.getUser()
        printBookInfo()
    }
    async getUser() {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Erreur aucun token trouvé");
        }
        try {
            const response = await fetch("http://localhost:3000/user/me", {
                method: "GET",
                headers: {"Authorization": `Bearer ${token}`}
            });

            if (!response.ok) {
                throw new Error("Utilisateur non authentifié");

            }
            const user = await response.json();
            console.log("✅ Donnée utilisateur récupérée  :", user);

            const welcomeText = document.getElementById("welcome");
            if (welcomeText) {
                welcomeText.textContent = `🎉 Bienvenue dans votre espace personnel, ${user.username} ! 😊`;
            } else {
                console.warn("⚠️ L'élément #welcome n'a pas été trouvé dans le DOM");
            }

        } catch (error) {
            console.error("⚠️ Erreur lors de la récupération des infos utilisateur :", error);
            //window.location.href="../public/login.html"
        }
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    new UserSpace();
})
 printBookInfo = () => {
    const bookDetails = JSON.parse(localStorage.getItem('bookDetails'));
    const status = localStorage.getItem('status');

     console.log('Status du livre : ',status)
     console.log("Livre enregistré :", bookDetails);
     console.log("L'isbn du livre : ", bookDetails.industryIdentifiers)
     console.log(`Le livre à ${bookDetails.pageCount} page`)

    if (bookDetails && status ) {
        if(status === "En cours"){
            document.getElementById('readList').textContent = "Livres en cours " + bookDetails.title + bookDetails.author;
        }else if(status === "A lire"){
            document.getElementById('readList').textContent = "Livres à lire  " + bookDetails.title + bookDetails.author;
        }else if(status === "Déja lu"){
            document.getElementById('readList').textContent = "Livres lus " + bookDetails.title + bookDetails.author;
        }
    }
    else
    {
        document.querySelector(".container").innerHTML = "<h2> Aucune donnée disponible</h2>";
    }
}
const userSpace = new UserSpace();
