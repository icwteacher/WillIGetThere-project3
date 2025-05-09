<?php
// Controleer of het formulier is ingediend
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Haal de gegevens op uit het formulier
    $email = $_POST['email'] ?? null;
    $wachtwoord = $_POST['wachtwoord'] ?? null;

    // Controleer of de velden niet leeg zijn
    if (!$email || !$wachtwoord) {
        die('Alle velden zijn verplicht.');
    }

    // Pad naar het XML-bestand
    $xmlFile = 'users.xml';

    // Controleer of het XML-bestand bestaat
    if (!file_exists($xmlFile)) {
        die('Geen gebruikers gevonden. Registreer eerst een account.');
    }

    // Laad het XML-bestand
    $xml = simplexml_load_file($xmlFile);

    // Zoek naar de gebruiker in het XML-bestand
    $gebruikerGevonden = false;
    foreach ($xml->user as $user) {
        if ((string) $user->email === $email) {
            $gebruikerGevonden = true;

            // Controleer of het wachtwoord overeenkomt
            if ((string) $user->wachtwoord === $wachtwoord) {
                echo 'Inloggen succesvol! Welkom, ' . htmlspecialchars($user->volledige_naam) . '!';
            } else {
                die('Onjuist wachtwoord.');
            }
            break;
        }
    }

    if (!$gebruikerGevonden) {
        die('Gebruiker niet gevonden.');
    }
}
?>