document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyCRg0DR7HyGGYqGCY7AvSrqPUifOF5Cz20';
    const maxResults = 40;

    function fetchBooks(query) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const books = data.items;
                const bookListContainer = document.getElementById("bookList");
                bookListContainer.innerHTML = '';

                if (books) {
                    books.forEach(book => {
                        const title = book.volumeInfo.title || "Titre inconnu";
                        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Auteur inconnu";
                        const coverUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/100x150?text=Pas+de+couverture";

                        const bookCard = document.createElement("div");
                        bookCard.classList.add("book-card");

                        bookCard.innerHTML = `
                                    <img src="${coverUrl}" alt="${title}">
                                    <div class="title">${title}</div>  
                                    <div class="author">${author}</div>
                                    <div class="buttons">
                                        <div class="stars">
                                            <span class="star" data-value="1">★</span>
                                            <span class="star" data-value="2">★</span>
                                            <span class="star" data-value="3">★</span>
                                        </div>
                                        <button class="like-btn">🤍</button>
                                    </div>
                                `;

                        bookListContainer.appendChild(bookCard);

                        const stars = bookCard.querySelectorAll(".star");
                        const likeButton = bookCard.querySelector(".like-btn");

                        // Gestion des étoiles
                        stars.forEach(star => {
                            star.addEventListener("click", () => {
                                const value = parseInt(star.getAttribute("data-value"));
                                stars.forEach(s => s.classList.remove("active"));
                                for (let i = 0; i < value; i++) {
                                    stars[i].classList.add("active");
                                }
                                alert(`Vous avez noté "${title}" avec ${value} étoile(s) !`);
                            });
                        });

                        // Gestion du bouton cœur
                        likeButton.addEventListener("click", () => {
                            if (likeButton.textContent === "🤍") {
                                likeButton.textContent = "❤️";
                                alert(`Vous aimez "${title}" !`);
                            } else {
                                likeButton.textContent = "🤍";
                                alert(`Vous n'aimez plus "${title}".`);
                            }
                        });
                    });
                } else {
                    const message = document.createElement("p");
                    message.textContent = "Aucun livre trouvé";
                    bookListContainer.appendChild(message);
                }
            })
            .catch(error => console.error("Erreur:", error));
    }

    fetchBooks("a");

    document.getElementById("searchButton").addEventListener("click", () => {
        const query = document.getElementById("searchInput").value;
        if (query) {
            fetchBooks(query);
        } else {
            alert("Veuillez entrer un terme de recherche.");
        }
    });
});