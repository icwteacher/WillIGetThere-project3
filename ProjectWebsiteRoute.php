<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Route Planner</title>
    <?php session_start(); ?>
    <script>
        // Haal de sessiegegevens uit PHP en zet ze in JavaScript
        const naam = <?php echo json_encode($_SESSION['naam'] ?? ''); ?>;
        const email = <?php echo json_encode($_SESSION['email'] ?? ''); ?>;

        window.onload = () => {
            document.getElementById('Naam').innerText = "Naam: " + naam;
            document.getElementById('email').innerText = "E-mail: " + email;
        };
    </script>
</head>
<body>

<div class="navbar">
    <a href="#Home">Home</a>
    <a href="#Over">Over</a>
    <a href="#Contact">Contact</a>

    <div class="profile-container">
        <div class="profile-icon" onclick="toggleMenu()">👤</div>
        <div class="dropdown-menu" id="menu">
            <p id="Naam">Naam: </p>
            <p id="email">E-mail: </p>
            <a href="logout.php">Uitloggen</a>
            <a href="ProjectWebsiteMijnRoutes.html">Mijn Routes</a>
        </div>
    </div>
</div>

<script src="ProjectWillIGetThere.js"></script>
</body>
</html>


