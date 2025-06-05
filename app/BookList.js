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
                        const categories = book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "Genre du livre inconnu";
                        const bookCard = document.createElement("div");
                        const publishedDate = book.volumeInfo.publishedDate || "Date de publication inconnue";
                        const industryIdentifiers = book.volumeInfo.industryIdentifiers;
                        const pageCount = book.volumeInfo.pageCount || "Non disponible";
                        const description = book.volumeInfo.description || "Non disponible";

                        bookCard.classList.add("book-card");

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

                        //gestion des clic etoiles
                        const stars = bookCard.querySelectorAll(".star");
                        const likeButton = bookCard.querySelector(".like-btn");

                        stars.forEach(star => {
                            star.addEventListener("click", async () => {
                                const clickedNote = parseInt(star.getAttribute("data-value"));

                                // Détecter la note actuelle
                                let currentNote = 0;
                                stars.forEach(s => {
                                    if (s.classList.contains("active")) currentNote = parseInt(s.getAttribute("data-value"));
                                });

                                // Déterminer la nouvelle note
                                let newNote = (clickedNote === currentNote) ? 0 : clickedNote;

                                const formData = {
                                    note: newNote,
                                    isbn: isbn,
                                    title: title
                                };

                                const result = await sendAvis(formData);

                                if (result.status >= 200 && result.status < 300) {
                                    // Mise à jour visuelle seulement si tout s'est bien passé
                                    stars.forEach(s => s.classList.remove("active"));
                                    for (let i = 0; i < newNote; i++) {
                                        stars[i].classList.add("active");
                                    }

                                    alert(`Vous avez noté "${title}" avec ${newNote} étoile(s) !`);
                                } else {
                                    alert(`Erreur : ${result.error.error || result.error.message || 'Impossible d\'enregistrer la note.'}`);
                                }
                            });
                        });

                        //gestion du bouton like
                        likeButton.addEventListener("click", async () => {
                            const isLiked = likeButton.textContent === "🤍";
                            const book_liked = isLiked;

                            const formData = {
                                book_liked: book_liked,
                                isbn: isbn,
                                title: title
                            };

                            const result = await sendAvis(formData);

                            if (result.status >= 200 && result.status < 300) {
                                // Mettre à jour le bouton uniquement si succès
                                likeButton.textContent = book_liked ? "❤️" : "🤍";
                                alert(book_liked ? `Vous aimez "${title}" !` : `Vous n'aimez plus "${title}".`);
                            } else {
                                alert(`Erreur : ${result.error.error || result.error.message || 'Impossible de mettre à jour le like.'}`);
                            }
                        });

                        async function sendAvis(formData) {
                            const token = localStorage.getItem("token");
                            try {
                                const response = await fetch(`http://localhost:3001/sendAvis`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${token}`,
                                    },
                                    body: JSON.stringify(formData)
                                });

                                const responseData = await response.json();

                                if (!response.ok) {
                                    // Côté serveur : réponse avec erreur (ex: 400, 500, etc)
                                    console.warn("Erreur côté serveur :", response.status, responseData);
                                    return { status: response.status, error: responseData };
                                }

                                // Succès
                                console.log("Réponse serveur OK :", responseData);
                                return { status: response.status, data: responseData };

                            } catch (error) {
                                // Erreur réseau ou exception JS
                                console.error("Erreur lors de l'envoi de l'avis au backend", error);
                                return { status: 500, error: { message: error.message } };
                            }
                        }

                        // Gestion du clic sur le titre du livre
                        bookCard.querySelector(".title").addEventListener("click", function () {
                            const bookInfo = {
                                title: title,
                                author: author,
                                description: description || "Aucune description disponible.",
                                publishedDate: publishedDate,
                                cover: coverUrl,
                                categories: categories,
                                industryIdentifiers: industryIdentifiers,
                                pageCount: pageCount,
                            };

                            localStorage.setItem("bookDetails", JSON.stringify(bookInfo));
                            window.location.href = "../public/BookDetail.html";
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
