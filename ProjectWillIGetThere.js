function toggleMenu() {
            var menu = document.getElementById("menu");
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        }

        window.onclick = function(event) 
        {
            if (!event.target.closest('.profile-container')) 
            {
                document.getElementById("menu").style.display = "none";
            }
        };
        document.getElementById('signupForm').addEventListener('submit', function(event) {
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

       document.addEventListener("DOMContentLoaded", function () {
        const params = new URLSearchParams(window.location.search);
        const naam = params.get("naam");
        if (naam) {
            document.body.innerHTML += `<p>Naam: ${naam}</p>`;
        } else {
            
        }
    });
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