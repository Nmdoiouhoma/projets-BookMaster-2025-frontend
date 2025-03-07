async function forgotPassword(event) {
    event.preventDefault();  // Empêche le formulaire de se soumettre de manière classique

    // Récupérer l'email entré par l'utilisateur
    const email = document.getElementById('email').value;

    if (!email) {
        alert("Veuillez entrer votre email.");
        return;
    }

    // Envoyer la requête pour demander la réinitialisation du mot de passe
    try {
        const response = await fetch('http://localhost:3000/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Un email vous a été envoyé pour réinitialiser votre mot de passe.');
        } else {
            alert(data.error || 'Une erreur s\'est produite.');
        }
    } catch (error) {
        console.error('Erreur de connexion', error);
        alert('Erreur serveur.');
    }
}

// Ajouter l'écouteur d'événements sur le formulaire
document.getElementById('forgotPassword').addEventListener('submit', forgotPassword);
