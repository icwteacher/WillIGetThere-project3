

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