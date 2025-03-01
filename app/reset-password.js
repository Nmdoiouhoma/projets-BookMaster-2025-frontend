async function verifyTokenAndRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        alert('Token manquant dans l\'URL.');
        return;
    }

    try {
        // Vérification du token sur le serveur
        const response = await fetch(`http://localhost:3000/verify-token?token=${token}`, {
            method: 'GET',  // Utiliser GET car on ne modifie pas encore les données
        });

        const data = await response.json();

        if (response.ok) {
            // Si le token est valide, afficher la page de réinitialisation
            document.getElementById('resetPasswordContainer').style.display = 'block';
        } else {
            alert("Token invalide ou expiré. Vous allez être redirigé.");
            window.location.href = '../public/login.html';

            window.location.href = '../public/login.html'; // Rediriger vers la page de connexion si le token est invalide
        }
    } catch (error) {
        console.error('Erreur de connexion', error);
        alert('Erreur serveur.');
        window.location.href = '../public/login.html'; // Rediriger vers la page de connexion en cas d'erreur
    }
}

// Appeler la fonction dès que la page est chargée
window.onload = verifyTokenAndRedirect;
