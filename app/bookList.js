document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyCRg0DR7HyGGYqGCY7AvSrqPUifOF5Cz20';  // Remplace cette clé par la tienne
    const maxResults = 40;

    // Fonction pour récupérer les livres
    function fetchBooks(query) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const books = data.items; // Les livres sont dans "items"
                const bookListContainer = document.getElementById("bookList");
                bookListContainer.innerHTML = ''; // Vide le container avant d'ajouter les nouveaux livres

                if (books) {
                    books.forEach(book => {
                        const title = book.volumeInfo.title || "Titre inconnu";
                        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Auteur inconnu";
                        const coverUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/100x150?text=Pas+de+couverture";

                        // Crée une carte pour chaque livre
                        const bookCard = document.createElement("div");
                        bookCard.classList.add("book-card");

                        bookCard.innerHTML = `
                                    <img src="${coverUrl}" alt="${title}">
                                    <div class="title">${title}</div>
                                    <div class="author">${author}</div>
                                `;
                        bookListContainer.appendChild(bookCard);
                    });
                } else {
                    // Affiche un message si aucun livre n'est trouvé
                    const message = document.createElement("p");
                    message.textContent = "Aucun livre trouvé";
                    bookListContainer.appendChild(message);
                }
            })
            .catch(error => console.error("Erreur:", error));
    }
    // Appeler fetchBooks avec un terme générique dès le chargement de la page
    fetchBooks("a");

    document.getElementById("searchButton").addEventListener("click", () => {
        const query = document.getElementById("searchInput").value;
        if (query) {
            fetchBooks(query); // Recherche un livre basé sur le texte de l'utilisateur
        } else {
            alert("Veuillez entrer un terme de recherche.");
        }
    });
});