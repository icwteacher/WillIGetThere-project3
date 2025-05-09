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
            const email = document.getElementById('email').value;
            const fullname = document.getElementById('volledige_naam').value;
            const password = document.getElementById('wachtwoord').value;
            alert(`Account created for ${fullname} with email ${email}`);
        });

       document.addEventListener("DOMContentLoaded", function () {
        const params = new URLSearchParams(window.location.search);
        const naam = params.get("naam");
        if (naam) {
            document.body.innerHTML += `<p>Naam: ${naam}</p>`;
        } else {
            document.body.innerHTML += "<p>Geen naam ontvangen.</p>";
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