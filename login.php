<?php
// Pad naar je XML-bestand
$xmlFile = 'users.xml';

// Ophalen POST-data
$email      = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$wachtwoord = filter_input(INPUT_POST, 'wachtwoord', FILTER_DEFAULT);

if (!$email || !$wachtwoord) {
    die('Vul e-mail en wachtwoord in.');
}

if (!file_exists($xmlFile)) {
    die('Nog geen geregistreerde gebruikers.');
}

// Laad XML
$xml = simplexml_load_file($xmlFile);

$gevonden = false;
foreach ($xml->user as $user) {
    if ((string)$user->email === $email) {
        $gevonden = true;
        $hash = (string)$user->password;
        if (password_verify($wachtwoord, $hash)) {
            echo 'Succesvol ingelogd! Welkom, ' . htmlspecialchars((string)$user->name) . '.';
        } else {
            echo 'Wachtwoord onjuist.';
        }
        break;
    }
}

if (!$gevonden) {
    echo 'Gebruiker niet gevonden.';
}
?>