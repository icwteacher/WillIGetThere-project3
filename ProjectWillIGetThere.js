function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
    if (!event.target.closest('.profile-container')) {
        document.getElementById("menu").style.display = "none";
    }
};

// Let op: De form submit listener in uw originele JS lijkt voor een signup/login form te zijn.
// Als Profile.html geen formulier met ID 'signupForm' heeft, kunt u deze listener verwijderen
// of aanpassen aan de functionaliteit van Profile.html.
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('wachtwoord');
    const fullnameField = document.getElementById('volledige_naam'); // Alleen voor registratiepagina

    if (emailField && passwordField) {
        const email = emailField.value;
        const password = passwordField.value;

        if (fullnameField) {
            const fullname = fullnameField.value;
            alert(`Account created for ${fullname} with email ${email}`);
        } else {
            alert(`Logging in with email: ${email}`);
        }
    } else {
        console.error('Email or password field not found in the DOM.');
    }
});

// Bestaande wachtwoord toggle functies - controleer of deze nog nodig zijn in Profile.html
// als u de nieuwe toggle gebruikt voor het weergeven van gebruikerswachtwoorden.
function toggleWachtwoord() {
  const wachtwoordVeld = document.getElementById("wachtwoord");
  if (wachtwoordVeld.type === "password") {
    wachtwoordVeld.type = "text";
  } else {
    wachtwoordVeld.type = "password";
  }
}

function toggleWachtwoord2() {
  const wachtwoordVeld = document.getElementById("herhaal_wachtwoord");
  if (wachtwoordVeld.type === "password") {
    wachtwoordVeld.type = "text";
  } else {
    wachtwoordVeld.type = "password";
  }
}


// Nieuwe code voor het laden en tonen van de ingelogde gebruiker
document.addEventListener("DOMContentLoaded", function() {
    // Haal de 'naam' parameter uit de URL
    const params = new URLSearchParams(window.location.search);
    const loggedInUserName = params.get("naam");

    const userEmailSpan = document.getElementById('user-email');
    const userFullnameSpan = document.getElementById('user-fullname');
    const userPasswordInput = document.getElementById('user-password');
    const togglePasswordButton = document.getElementById('toggle-password');
    const userProfileDetailsDiv = document.getElementById('user-profile-details');
    const userNotFoundMessageDiv = document.getElementById('user-not-found-message');


    // Controleer of een naam is doorgegeven in de URL
    if (!loggedInUserName) {
        console.log("Geen naam gevonden in URL parameters. Kan ingelogde gebruiker niet tonen.");
        if (userProfileDetailsDiv) userProfileDetailsDiv.style.display = 'none';
        if (userNotFoundMessageDiv) userNotFoundMessageDiv.style.display = 'block';
        // Schakel wachtwoord toggle uit als er geen gebruiker is
        if (togglePasswordButton) togglePasswordButton.disabled = true;
        return; // Stop verdere uitvoering als geen naam is gevonden
    }

    console.log(`Zoeken naar gebruiker met naam: ${loggedInUserName}`);

    // Laad de gebruikersgegevens uit users.xml
    fetch('users.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(str => (new DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const users = data.querySelectorAll('user');
            let foundUser = null;

            // Zoek de gebruiker die overeenkomt met de naam uit de URL
            users.forEach(user => {
                const name = user.querySelector('name')?.textContent; // Kan 'name' zijn
                const volledige_naam = user.querySelector('volledige_naam')?.textContent; // Kan 'volledige_naam' zijn

                // Vergelijk de naam uit de XML met de naam uit de URL (case-insensitive)
                if (name && name.toLowerCase() === loggedInUserName.toLowerCase()) {
                    foundUser = {
                        email: user.querySelector('email')?.textContent,
                        name: name,
                        password: user.querySelector('wachtwoord')?.textContent || user.querySelector('password')?.textContent // Kan 'wachtwoord' of 'password' zijn
                    };
                } else if (volledige_naam && volledige_naam.toLowerCase() === loggedInUserName.toLowerCase()) {
                     foundUser = {
                        email: user.querySelector('email')?.textContent,
                        volledige_naam: volledige_naam,
                        password: user.querySelector('wachtwoord')?.textContent || user.querySelector('password')?.textContent // Kan 'wachtwoord' of 'password' zijn
                    };
                }
            });

            if (foundUser) {
                console.log("Gebruiker gevonden:", foundUser);
                // Toon de gegevens van de gevonden gebruiker
                if (userEmailSpan) userEmailSpan.textContent = foundUser.email || 'Geen email';
                // Toon de naam die overeenkwam (name of volledige_naam)
                if (userFullnameSpan) userFullnameSpan.textContent = foundUser.name || foundUser.volledige_naam || 'Geen naam';
                if (userPasswordInput) {
                    userPasswordInput.value = foundUser.password || 'Geen wachtwoord';
                    userPasswordInput.type = 'password'; // Zet het wachtwoordveld standaard op 'password'
                }

                // Zorg ervoor dat de juiste divs zichtbaar zijn
                if (userProfileDetailsDiv) userProfileDetailsDiv.style.display = 'block';
                if (userNotFoundMessageDiv) userNotFoundMessageDiv.style.display = 'none';
                 // Schakel wachtwoord toggle in
                if (togglePasswordButton) togglePasswordButton.disabled = false;

            } else {
                console.log(`Gebruiker met naam '${loggedInUserName}' niet gevonden in users.xml.`);
                // Toon bericht dat gebruiker niet gevonden is
                if (userProfileDetailsDiv) userProfileDetailsDiv.style.display = 'none';
                if (userNotFoundMessageDiv) userNotFoundMessageDiv.style.display = 'block';
                 // Schakel wachtwoord toggle uit
                if (togglePasswordButton) togglePasswordButton.disabled = true;
            }
        })
        .catch(error => {
            console.error('Fout bij het laden of parsen van users.xml:', error);
            // Toon foutbericht
            if (userProfileDetailsDiv) userProfileDetailsDiv.style.display = 'none';
            if (userNotFoundMessageDiv) {
                userNotFoundMessageDiv.style.display = 'block';
                userNotFoundMessageDiv.innerHTML = "<p style='color: red;'>Kon gebruikersgegevens niet laden.</p>";
            }
             // Schakel wachtwoord toggle uit bij fout
            if (togglePasswordButton) togglePasswordButton.disabled = true;
        });

    // Event listener voor wachtwoord toggle (blijft hetzelfde)
    if(togglePasswordButton && userPasswordInput) {
        togglePasswordButton.addEventListener('click', () => {
            if (userPasswordInput.type === 'password') {
                userPasswordInput.type = 'text';
                togglePasswordButton.textContent = 'Verberg';
            } else {
                userPasswordInput.type = 'password';
                togglePasswordButton.textContent = 'Toon/Verberg';
            }
        });
    }
});
