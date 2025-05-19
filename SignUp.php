<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$xmlFile = 'users.xml';

// Input ophalen en valideren
$email             = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$volledigeNaam     = filter_input(INPUT_POST, 'volledige_naam', FILTER_SANITIZE_STRING);
$wachtwoord        = filter_input(INPUT_POST, 'wachtwoord', FILTER_DEFAULT);
$herhaalWachtwoord = filter_input(INPUT_POST, 'herhaal_wachtwoord', FILTER_DEFAULT);

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
$new->addChild('email',    htmlspecialchars($email));
$new->addChild('name',     htmlspecialchars($volledigeNaam));
$new->addChild('password', password_hash($wachtwoord, PASSWORD_DEFAULT));

// Sla op en stop
if ($xml->asXML($xmlFile) === false) {
    die('Fout bij opslaan gebruikersbestand.');
}

die('Registratie succesvol! Je kunt nu inloggen.');
?>