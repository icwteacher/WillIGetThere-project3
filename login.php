<?php
session_start();

// Pad naar je XML-bestand
$xmlFile = 'users.xml';

// Ophalen POST-data
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$wachtwoord = filter_input(INPUT_POST, 'wachtwoord', FILTER_DEFAULT);

// Controleer of de velden zijn ingevuld
if (!$email || !$wachtwoord) {
    die('Vul zowel e-mail als wachtwoord in.');
}

// Controleer of het XML-bestand bestaat
if (!file_exists($xmlFile)) {
    die('Er zijn nog geen geregistreerde gebruikers.');
}

// Laad het XML-bestand
$xml = simplexml_load_file($xmlFile);
if ($xml === false) {
    die('Fout bij het laden van het XML-bestand.');
}

// Zoek naar de gebruiker in de XML
$gevonden = false;
foreach ($xml->user as $user) {
    $xmlEmail = trim((string)$user->email); // Verwijder witruimtes

    // Controleer of het e-mailadres overeenkomt (hoofdletterongevoelig)
    if (strcasecmp($xmlEmail, $email) === 0) {
        $gevonden = true;

        // Controleer of het wachtwoord klopt
        $xmlPassword = trim((string)($user->wachtwoord ?? $user->password)); // Ondersteun beide structuren
        if ($xmlPassword === $wachtwoord) {
            // Succesvol ingelogd
            $_SESSION['gebruiker'] = trim((string)($user->volledige_naam ?? $user->name));
            header('Location: Main.html'); // Redirect naar Main.html
            exit;
        } else {
            die('Onjuist wachtwoord.');
        }
    }
}

// Als de gebruiker niet is gevonden
if (!$gevonden) {
    die('Gebruiker niet gevonden.');
}
?>