class  UpdateBook {
    constructor() {
        this.printOneBook()
        this.sendStatus()
        this.deleteBook()
    }

    async printOneBook() {
        try {

            const urlParams = new URLSearchParams(window.location.search);
            const bookId = urlParams.get('id');

            if (!bookId) {
                console.error("Aucun ID de livre fourni");
            } else {
                console.log("📘 ID du livre à modifier :", bookId);

            }

            const response = await fetch(`http://localhost:3001/getBook/${bookId}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            if (!response.ok) {
                throw new Error('Impossible de récupérer le livre');
            }

            const data = await response.json();
            console.log("📚 Le livre a bien été récupéré :", data);

            const container = document.getElementById("bookContainer");
            if (!container) {
                console.warn("⚠️ Conteneur 'bookContainer' introuvable dans le DOM");
                return;
            }

                const book = data.books
                 this.spaceId = book.space_id
                 this.bookId = bookId

            console.log("book id ", this.bookId)
                const bookElement = document.createElement("div");
                bookElement.classList.add("book-item");

                const coverUrl = book.Book?.cover;
                const coverImage = document.createElement("img");

                if (coverUrl) {
                    coverImage.src = coverUrl;
                    coverImage.alt = book.Book.title || "Couverture de livre";
                    coverImage.classList.add("book-cover");
                } else {
                    coverImage.src = "https://via.placeholder.com/150";
                    coverImage.alt = "Couverture non disponible";
                }

                const bookTitle = document.createElement("p");
                bookTitle.textContent = `${book.Book?.title || "Titre inconnu"}`;
                const bookAuthor = document.createElement("p");
                bookAuthor.textContent = `Auteur : ${book.Book?.author || "Auteur inconnu"}`;
                const bookPageCount = document.createElement("p");
                bookPageCount.textContent = `${book.Book?.page_count || "?"} pages`;

               bookTitle.classList.add("book-title");
               bookAuthor.classList.add("book-author");
               bookPageCount.classList.add("book-page-count");


                bookElement.appendChild(coverImage);
                bookElement.appendChild(bookTitle);
                bookElement.appendChild(bookAuthor);
                bookElement.appendChild(bookPageCount);

                container.appendChild(bookElement);

            const pageCount = data.books.Book?.page_count || 100; // Par défaut 100 si pas trouvé
            const currentPage = data.books?.current_page || 1;
            this.pageCount = pageCount;
            this.currentPage = currentPage;


            this.updateProgressInfo(currentPage, pageCount);
            this.selectCurrentPage(pageCount, currentPage);


        } catch (error) {
            console.error("⚠️ Erreur :", error);
        }
    }

    async SendUpdateBook() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté !");
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const bookId = urlParams.get('id');
            const newStatus = document.getElementById("statusSelect").value;
            const newPage = document.getElementById("currentPageSelect").value
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userId = decodedToken.id;

            const response = await fetch(`http://localhost:3001/updateBook/${userId}/${bookId}`,  {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({status: newStatus, current_page: newPage})
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const responseData = await response.json();
            console.log("📬 Réponse complète du serveur :", responseData);

            alert("Livre mis à jour avec succès !");

            this.updateProgressInfo(this.currentPage, this.pageCount);
            this.currentPage = parseInt(newPage);

        } catch (error) {
            console.error("Erreur lors de la mise à jour du livre :", error);
            alert("Impossible de mettre à jour le livre !");
        }
        setTimeout(() => {
            window.location.href = '../public/UserSpace.html';
        }, 1000);
    }
    sendStatus() {
        const submitButton = document.getElementById("submitUpdateButton");
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();  // Empêche le rechargement de la page

            this.SendUpdateBook();
        });
    }

    updateProgressInfo(currentPage, totalPages)  {
        const progressInfo = document.getElementById("progressInfo")
        const progressBar = document.getElementById("progressBar")
        const pourcentage = currentPage / totalPages;
            console.log("✅ updateProgressInfo appelée avec :", currentPage, totalPages);

        if(progressInfo && progressBar) {

            progressBar.value = currentPage;
            progressBar.max = totalPages;
            progressInfo.textContent = `${currentPage} / ${totalPages}`;

            progressBar.classList.remove("law","medium","high");

            if(pourcentage <= 0.33){
                progressBar.classList.add("law");
            } else if(pourcentage <= 0.66){
                progressBar.classList.add("medium");
            } else {
                progressBar.classList.add("high");
            }
        }
    }

    selectCurrentPage(totalPages, currentPage = 1) {
        const select = document.getElementById("currentPageSelect");
        select.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Page ${i}`;
            if (i === currentPage) option.selected = true;
            select.appendChild(option);
        }
    }
    deleteBook() {
        const deleteButton = document.getElementById("deleteBook")

        if(!deleteButton){
            console.warn("Erreur #deleteButton non trouvé")
        }
        deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.fetchDeleteBook()
        })
    }
    async fetchDeleteBook(){

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté !");
            return;
        }
        const spaceId = this.spaceId
        const bookId = this.bookId

        try{
            const response = await fetch(`http://localhost:3001/deleteBook/${spaceId}/${bookId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const responseData = await response.json();
            console.log("📬 Réponse complète du serveur :", responseData);

            alert("Livre supprimé avec succès !");
            window.location.href='../public/UserSpace.html'

        }catch(error){
            console.log('Erreur lors de la supression du livre', error)
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const updateBook = new UpdateBook();
})
