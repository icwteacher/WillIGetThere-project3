<?php
session_start();

// Zorg ervoor dat de gebruiker is ingelogd voordat je routes opslaat of ophaalt
if (!isset($_SESSION['gebruiker'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'Gebruiker niet ingelogd.']);
    exit;
}

$gebruiker = $_SESSION['gebruiker'];
$routesFile = __DIR__ . '/data/routes.xml';

// Zorg ervoor dat de data map bestaat
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0777, true);
}

// Functie om XML te laden of een nieuwe te maken
function loadRoutesXml($filePath) {
    if (file_exists($filePath)) {
        // Gebruik libxml_disable_entity_loader om XXE-aanvallen te voorkomen
        $old_libxml_entity_loader = libxml_disable_entity_loader(true);
        $xml = simplexml_load_file($filePath);
        libxml_disable_entity_loader($old_libxml_entity_loader);
        if ($xml === false) {
            // Bestand bestaat maar is ongeldige XML
            return new SimpleXMLElement('<routes></routes>');
        }
        return $xml;
    } else {
        // Bestand bestaat niet, maak een nieuwe root element
        return new SimpleXMLElement('<routes></routes>');
    }
}

// Functie om XML op te slaan
function saveRoutesXml($xml, $filePath) {
    // Gebruik asXML() om de XML-string te krijgen en file_put_contents om veilig op te slaan
    $xmlString = $xml->asXML();
    if ($xmlString === false) {
        return false; // Fout bij het genereren van de XML-string
    }
    return file_put_contents($filePath, $xmlString) !== false;
}


// Laad de bestaande routes XML
$xml = loadRoutesXml($routesFile);

// POST: voeg nieuwe route toe
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lees de JSON input
    $json_data = file_get_contents('php://input');
    $route_data = json_decode($json_data, true);

    $vertrek = $route_data['start'] ?? '';
    $bestemming = $route_data['end'] ?? '';
    $afstand = $route_data['distance'] ?? '';

    if (!$vertrek || !$bestemming || !$afstand) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Ongeldige invoer.']);
        exit;
    }

    // Zoek de gebruiker in de XML of maak een nieuwe aan
    $userNode = null;
    foreach ($xml->user as $user) {
        if ((string)$user['id'] === $gebruiker) {
            $userNode = $user;
            break;
        }
    }

    if ($userNode === null) {
        // Gebruiker bestaat nog niet, voeg toe
        $userNode = $xml->addChild('user');
        $userNode->addAttribute('id', $gebruiker);
    }

    // Voeg de nieuwe route toe aan de gebruiker
    $routeNode = $userNode->addChild('route');
    $routeNode->addChild('vertrek', htmlspecialchars($vertrek)); // Gebruik htmlspecialchars om injectie te voorkomen
    $routeNode->addChild('bestemming', htmlspecialchars($bestemming));
    $routeNode->addChild('afstand', htmlspecialchars($afstand));
    $routeNode->addChild('datum', date('Y-m-d H:i:s'));

    // Sla de bijgewerkte XML op
    if (saveRoutesXml($xml, $routesFile)) {
        echo json_encode(['success' => true, 'message' => 'Route succesvol opgeslagen.']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Fout bij het opslaan van de route.']);
    }

    exit;
}

// GET: Haal routes op voor de ingelogde gebruiker
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userRoutes = [];
    foreach ($xml->user as $user) {
        if ((string)$user['id'] === $gebruiker) {
            foreach ($user->route as $route) {
                $userRoutes[] = [
                    'vertrek' => (string)$route->vertrek,
                    'bestemming' => (string)$route->bestemming,
                    'afstand' => (string)$route->afstand,
                    'datum' => (string)$route->datum,
                ];
            }
            break; // Stop zodra de gebruiker is gevonden
        }
    }

    echo json_encode(['success' => true, 'routes' => $userRoutes]);
    exit;
}

// Als een ander type verzoek wordt ontvangen
http_response_code(405); // Method Not Allowed
echo json_encode(['success' => false, 'message' => 'Methode niet toegestaan.']);

?>
