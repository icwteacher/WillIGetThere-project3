document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('wachtwoord');

    if (emailField && passwordField) {
        const email = emailField.value;
        const password = passwordField.value;

        try {
            // Fetch de XML-data
            const response = await fetch('users.xml');
            if (!response.ok) {
                throw new Error('Kan users.xml niet laden.');
            }

            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

            // Zoek naar de gebruiker in de XML
            const users = xmlDoc.getElementsByTagName('user');
            let userFound = false;

            for (let i = 0; i < users.length; i++) {
                const emailElement = users[i].getElementsByTagName('email')[0];
                const passwordElement = users[i].getElementsByTagName('wachtwoord')[0];

                if (emailElement && passwordElement) {
                    const userEmail = emailElement.textContent;
                    const userPassword = passwordElement.textContent;

                    if (userEmail === email) {
                        userFound = true;
                        if (userPassword === password) {
                            alert(`Succesvol ingelogd! Welkom, ${email}`);
                            window.location.href = 'Main.html'; // Redirect naar Main.html
                        } else {
                            alert('Onjuist wachtwoord.');
                        }
                        break;
                    }
                }
            }

            if (!userFound) {
                alert('Gebruiker niet gevonden.');
            }
        } catch (error) {
            console.error('Fout bij het verwerken van de XML:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
        }
    } else {
        console.error('Email of wachtwoordveld niet gevonden in de DOM.');
    }
});

// Functie om het wachtwoordveld te toggelen
function toggleWachtwoord() {
    const wachtwoordVeld = document.getElementById('wachtwoord');
    if (wachtwoordVeld.type === 'password') {
        wachtwoordVeld.type = 'text';
    } else {
        wachtwoordVeld.type = 'password';
    }
}

// Functie om het menu te toggelen
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Sluit het menu als je buiten klikt
window.onclick = function (event) {
    if (!event.target.closest('.profile-container')) {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.style.display = 'none';
        }
    }
};