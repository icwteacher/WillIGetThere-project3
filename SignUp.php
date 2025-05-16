<?php
$email = $_POST['email'];
$wachtwoord = password_hash($_POST['wachtwoord'], PASSWORD_DEFAULT); // versleuteld

$xmlFile = 'gebruikers.xml';

$xml = simplexml_load_file($xmlFile);

// Check of email al bestaat
foreach ($xml->gebruiker as $gebruiker) {
    if ((string)$gebruiker->email === $email) {
        die("Deze email is al geregistreerd.");
    }
}

// Nieuwe gebruiker toevoegen
$gebruiker = $xml->addChild('gebruiker');
$gebruiker->addChild('email', $email);
$gebruiker->addChild('wachtwoord', $wachtwoord);

// Opslaan
$xml->asXML($xmlFile);

echo "Account aangemaakt. <a href='login.html'>Log in</a>";
?>
