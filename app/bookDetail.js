
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

});
    document.getElementById("status").addEventListener("mousedown", function (e) {
        this.classList.add("open");
        setTimeout(() => this.classList.remove("open"), 200);
    });

addBook = () => {
    //Implementer la fonction pour enregistrer un livre
}