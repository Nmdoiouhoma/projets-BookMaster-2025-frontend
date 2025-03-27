
    document.addEventListener('DOMContentLoaded', () => {
        const bookDetails = JSON.parse(localStorage.getItem('bookDetails'));

        if (bookDetails) {
            document.getElementById('bookTitle').textContent = bookDetails.title;
            document.getElementById('bookAuthor').textContent = "Auteur : " + bookDetails.author;
            document.getElementById('bookDescription').textContent = "Synopsis : " + bookDetails.description;
            document.getElementById('bookDate').textContent = "Date de publication : " + bookDetails.publishedDate;
            document.getElementById('bookCategory').textContent ="Genre : " + bookDetails.categories;
        const bookCover = document.getElementById('bookCover');
        if (bookDetails.cover) {
            bookCover.src = bookDetails.cover;
            console.log('L\'image', bookDetails.cover);// Assigner l'URL de l'image à l'attribut `src`
        } else {
            bookCover.alt = "Couverture non disponible";  // Mettre une alternative si l'image n'existe pas
            bookCover.src = "https://via.placeholder.com/150";  // Mettre une image par défaut
        }
    }else
        {
            document.querySelector(".container").innerHTML = "<h2> Aucune donnée disponible</h2>";
        }
        addBook();

});

    function addBook() {
        const submitButton = document.getElementById("submitButton");
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();  // Empêche le comportement par défaut du bouton

            const status = document.getElementById("statusSelect").value;

            const bookDetails = JSON.parse(localStorage.getItem('bookDetails'));

            if (bookDetails) {
                // Enregistre le statut et les informations du livre dans le localStorage
                localStorage.setItem("Le status du livre", status);
                localStorage.setItem("bookDetails", JSON.stringify(bookDetails));

                alert('Livre enregistré avec succès');

                // Redirige vers l'espace personnel
                window.location.href = "../public/userSpace.html";
            } else {
                alert("Aucune information de livre trouvée.");
            }
        });
    }
