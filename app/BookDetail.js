
class BookDetail {
    constructor() {
        this.printBook()
        this.addBook()
    }
    printBook = () => {
        document.addEventListener('DOMContentLoaded', () => {
            const bookDetails = JSON.parse(localStorage.getItem('bookDetails'));

            if (bookDetails) {
                document.getElementById('bookTitle').textContent = bookDetails.title;
                document.getElementById('bookAuthor').textContent = "Auteur : " + bookDetails.author;
                document.getElementById('bookDescription').textContent = "Synopsis : " + bookDetails.description;
                document.getElementById('bookDate').textContent = "Date de publication : " + bookDetails.publishedDate;
                document.getElementById('bookCategory').textContent = "Genre : " + bookDetails.categories;
                const bookCover = document.getElementById('bookCover');

                if (bookDetails.cover) {
                    bookCover.src = bookDetails.cover;
                } else {
                    bookCover.alt = "Couverture non disponible";  // Mettre une alternative si l'image n'existe pas
                    bookCover.src = "https://via.placeholder.com/150";  // Mettre une image par défaut
                }
            } else {
                document.querySelector(".container").innerHTML = "<h2> Aucune donnée disponible</h2>";
            }
        });
    }
    async saveBook() {
        const status = document.getElementById("statusSelect").value;
        const bookDetails = JSON.parse(localStorage.getItem('bookDetails'));

        const industryIdentifiers = bookDetails.industryIdentifiers;

        let isbn = "ISBN non disponible";

        // Vérifie si des identifiants existent
        if (industryIdentifiers && industryIdentifiers.length > 0) {
            // Cherche un ISBN 13 en priorité, sinon ISBN 10
            const isbnObj = industryIdentifiers.find(id => id.type === "ISBN_13")
                || industryIdentifiers.find(id => id.type === "ISBN_10");

            // Si un ISBN est trouvé, on stocke l’identifiant
            if (isbnObj) {
                isbn = isbnObj.identifier;
            }
        }
        const bookData = {
            title: bookDetails.title,
            author: bookDetails.author,
            description: bookDetails.description,
            publishedDate: bookDetails.publishedDate,
            genre: bookDetails.categories,
            cover: bookDetails.cover,
            status: status,
            isbn: isbn,
            page_count: bookDetails.pageCount,
        };

        const responseData = await this.insert(bookData)

        if (responseData === 201) {
            alert("Envoi des donnés vers la base de donnée reussi ✅ : ")
            window.location.href = "../public/UserSpace.html"
        } else {
            alert("Erreur l\'envoie des donnés a échoué")

        }
    }
    async insert(bookData) {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token manquant");
                return 401;
            }
                const response = await fetch(`http://localhost:3001/addBook`, {
                method: "POST",
                headers: {"content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bookData),
            });
            const data = await response.json();
            console.log("Réponse complète du serveur :", data);
            return response.status
        } catch (erreur) {
            console.error("Erreur lors de l'envoie des donnés")
            return 500;
        }
    }

    addBook() {
        const submitButton = document.getElementById("submitButton");
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();  // Empêche le rechargement de la page

            this.saveBook(); // Appelle la méthode pour enregistrer le livre dans la BDD
        });
    }
}
    bookDetail = new BookDetail()