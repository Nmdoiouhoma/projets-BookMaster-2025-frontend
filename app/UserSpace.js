class UserSpace {
    constructor() {
        this.getUser();
        this.printBookInfo();
    }

    async getUser() {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Erreur : Aucun token trouvé.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/user/me", {
                method: "GET",
                headers: {"Authorization": `Bearer ${token}`}
            });

            if (!response.ok) {
                throw new Error("Utilisateur non authentifié");
            }

            const user = await response.json();
            console.log("✅ Donnée utilisateur récupérée :", user);

            // Affichage du pseudo
            const welcomeText = document.getElementById("welcome");
            if (welcomeText) {
                welcomeText.textContent = `🎉 Bienvenue dans ton espace personnel ${user.username} ! 😊`;
            }

            // Affichage de l'avatars
            const avatarElement = document.getElementById("userAvatar");
            if (avatarElement) {
                if (user.avatar) {
                    avatarElement.src = `http://localhost:3001${user.avatar}`; // Ajoute le bon chemin
                } else {
                    avatarElement.src = "https://via.placeholder.com/100";
                    avatarElement.alt = "Avatar non disponible";
                }
            }

        } catch (error) {
            console.error("⚠️ Erreur lors de la récupération des infos utilisateur :", error);
        }
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

    async printBookInfo() {
        const userId = this.getUserIdFromToken();
        if (!userId) {
            console.error("Aucun utilisateur trouvé. Veuillez vous connecter.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/getListBook/${userId}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            if (!response.ok) {
                throw new Error('Impossible de récupérer la liste de livres');
            }

            const data = await response.json();
            console.log("📚 Les livres ont bien été récupérés", data);

            const readContainer = document.getElementById("read_book");
            const toReadContainer = document.getElementById("read_to_book");
            const inProgressContainer = document.getElementById("book_in_progress");

            data.books.forEach(book => {
                // Création d'un conteneur pour chaque livre
                const bookElement = document.createElement("div");
                bookElement.classList.add("book-item");

                // Création de l'élément image pour la couverture
                const coverUrl = book.Book?.cover;
                const coverImage = document.createElement("img");

                if (coverUrl) {
                    coverImage.src = coverUrl;
                    coverImage.alt = book.Book?.title || "Couverture de livre";
                    coverImage.classList.add("book-cover");
                } else {
                    coverImage.src = "https://via.placeholder.com/150";
                    coverImage.alt = "Couverture non disponible";
                }

                // Création du texte contenant le titre, l'auteur et le nombre de pages
                const bookTitle = document.createElement("p");
                bookTitle.textContent = `${book.Book?.title || "Titre inconnu"}`;

                const bookAuthor = document.createElement("p");
                bookAuthor.textContent = `Auteur : ${book.Book?.author || "Auteur inconnu"}`;

                const bookPageCount = document.createElement("p");
                bookPageCount.textContent = `${book.Book?.page_count || "?"} pages`;

                const updateButton = document.createElement("p")

                updateButton.innerHTML = `<button onclick="window.location.href='../public/updateBook.html?id=${book.book_id}'">Modifier</button>`;

                // Ajout de la couverture et des informations dans le conteneur du livre
                bookElement.appendChild(coverImage);
                bookElement.appendChild(bookTitle);
                bookElement.appendChild(bookAuthor);
                bookElement.appendChild(bookPageCount);
                bookElement.appendChild(updateButton)

                console.log("L'id du livre : ", book.book_id)
                // Ajout du livre au bon conteneur en fonction de son statut
                if (book.status === "Déja lu") {

                    readContainer.appendChild(bookElement);
                } else if (book.status === "A lire") {
                    toReadContainer.appendChild(bookElement);
                } else if (book.status === "En cours") {
                    inProgressContainer.appendChild(bookElement);
                } else {
                    console.warn("⚠️ Statut inconnu :", book.status);
                }

            });

        } catch (error) {
            console.error("⚠️ Erreur :", error);
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new UserSpace();
});
