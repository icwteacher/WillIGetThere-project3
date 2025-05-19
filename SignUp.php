<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Script gestart.<br>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "Formulier verzonden.<br>";

    $email = $_POST['email'] ?? null;
    $wachtwoord = $_POST['wachtwoord'] ?? null;

    echo "Email: $email<br>";
    echo "Wachtwoord: $wachtwoord<br>";

    if (!$email || !$wachtwoord) {
        die("Alle velden zijn verplicht.");
    }

    $xmlFile = 'users.xml';

    // Controleer of het XML-bestand bestaat, zo niet, maak een basisstructuur
    if (!file_exists($xmlFile)) {
        echo "XML-bestand niet gevonden. Aanmaken...<br>";
        $xmlContent = '<?xml version="1.0" encoding="UTF-8"?><users></users>';
        file_put_contents($xmlFile, $xmlContent);
    }

    // Laad het XML-bestand
    $xml = simplexml_load_file($xmlFile);
    if ($xml === false) {
        die("Kan XML-bestand niet laden. Controleer of het bestand bestaat en geldig is.");
    } else {
        echo "XML-bestand geladen.<br>";
    }

    // Controleer of het e-mailadres al bestaat
    foreach ($xml->user as $user) {
        if ((string)$user->email === $email) {
            die("Deze email is al geregistreerd.");
        }
    }

    // Voeg een nieuwe gebruiker toe
    echo "Gebruiker toevoegen...<br>";
    $user = $xml->addChild('user');
    $user->addChild('email', htmlspecialchars($email));
    $user->addChild('wachtwoord', htmlspecialchars($wachtwoord));

    // Sla de wijzigingen op
    if ($xml->asXML($xmlFile)) {
        echo "Account succesvol aangemaakt. <a href='login.html'>Log in</a>";
    } else {
        echo "Fout bij het opslaan van het account.";
    }
}
?>
