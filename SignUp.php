<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start(); // Start een sessie om meldingen door te geven

$xmlFile = 'users.xml';

// Input ophalen en valideren
$email             = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$volledigeNaam     = htmlspecialchars($_POST['volledige_naam'] ?? '', ENT_QUOTES, 'UTF-8');
$wachtwoord        = $_POST['wachtwoord'] ?? '';
$herhaalWachtwoord = $_POST['herhaal_wachtwoord'] ?? '';

if (!$email || !$volledigeNaam || !$wachtwoord) {
    die('Ongeldige invoer.');
}

if ($wachtwoord !== $herhaalWachtwoord) {
    die('Wachtwoorden komen niet overeen.');
}

// Laad of maak XML
if (file_exists($xmlFile)) {
    $xml = simplexml_load_file($xmlFile);
    if ($xml === false) {
        die('Fout bij inladen XML.');
    }
} else {
    // Maak root-element aan
    $xml = new SimpleXMLElement('<users/>');
}

// Check op bestaande e-mail
foreach ($xml->user as $user) {
    if ((string)$user->email === $email) {
        die('Deze e-mail is al geregistreerd.');
    }
}

// Voeg nieuwe gebruiker toe
$new = $xml->addChild('user');
$new->addChild('email', htmlspecialchars($email, ENT_QUOTES, 'UTF-8'));
$new->addChild('name', htmlspecialchars($volledigeNaam, ENT_QUOTES, 'UTF-8'));
$new->addChild('password', htmlspecialchars($wachtwoord, ENT_QUOTES, 'UTF-8')); // Geen hashing zoals gevraagd

// Sla op en stop
if ($xml->asXML($xmlFile) === false) {
    die('Fout bij opslaan gebruikersbestand.');
}

// Zet een succesmelding in de sessie
$_SESSION['melding'] = 'Registratie succesvol! Je kunt nu inloggen.';

// Redirect naar LogIn.html
header('Location: LogIn.html');
exit;
?>