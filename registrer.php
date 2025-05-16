<?php
// filepath: c:\Users\thor.vroman\OneDrive - Anker VZW\Documenten\6ICW\Project\WillIGetThere\WillIGetThere-project3\register.php

// Controleer of het formulier is ingediend
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Haal de gegevens op uit het formulier
    $email = $_POST['email'] ?? null;
    $volledige_naam = $_POST['volledige_naam'] ?? null;
    $wachtwoord = $_POST['wachtwoord'] ?? null;
    $herhaal_wachtwoord = $_POST['herhaal_wachtwoord'] ?? null;

    // Controleer of de velden niet leeg zijn
    if (!$email || !$volledige_naam || !$wachtwoord || !$herhaal_wachtwoord) {
        die('Alle velden zijn verplicht.');
    }

    // Controleer of de wachtwoorden overeenkomen
    if ($wachtwoord !== $herhaal_wachtwoord) {
        die('Wachtwoorden komen niet overeen.');
    }

    // Pad naar het XML-bestand
    $xmlFile = 'users.xml';

    // Controleer of het XML-bestand bestaat, zo niet, maak een basisstructuur
    if (!file_exists($xmlFile)) {
        $xmlContent = '<?xml version="1.0" encoding="UTF-8"?><users></users>';
        file_put_contents($xmlFile, $xmlContent);
    }

    // Laad het XML-bestand
    $xml = simplexml_load_file($xmlFile);

    // Voeg een nieuwe gebruiker toe
    $newUser = $xml->addChild('user');
    $newUser->addChild('email', htmlspecialchars($email));
    $newUser->addChild('volledige_naam', htmlspecialchars($volledige_naam));
    $newUser->addChild('wachtwoord', htmlspecialchars($wachtwoord)); // Wachtwoord wordt niet gehashed

    // Sla de wijzigingen op in het XML-bestand
    $xml->asXML($xmlFile);

    echo 'Gebruiker succesvol geregistreerd!';
}
?>