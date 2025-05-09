<?php
$email = $_POST['email'];
$wachtwoord = $_POST['wachtwoord'];

$xml = simplexml_load_file('gebruikers.xml');

foreach ($xml->gebruiker as $gebruiker) {
    if ((string)$gebruiker->email === $email) {
        if (password_verify($wachtwoord, (string)$gebruiker->wachtwoord)) {
            echo "Succesvol ingelogd!";
            // header("Location: ProjectWebsiteRoute.html");
            exit;
        } else {
            die("Fout wachtwoord.");
        }
    }
}
echo "Gebruiker niet gevonden.";
?>
