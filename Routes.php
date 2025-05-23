<?php
session_start();

// Simuleer gebruiker (in een echte app haal je dit uit de login)
// Zorg ervoor dat de gebruiker is ingelogd voordat je routes opslaat
if (!isset($_SESSION['gebruiker'])) {
    // Stuur een foutrespons als de gebruiker niet is ingelogd
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'Gebruiker niet ingelogd.']);
    exit;
}

$gebruiker = $_SESSION['gebruiker'];
$dataFile = __DIR__ . '/data/routes.json';

// Zorg ervoor dat de data map bestaat
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0777, true);
}

// Lees bestaande data
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}
$data = json_decode(file_get_contents($dataFile), true);

// POST: voeg nieuwe route toe
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lees de JSON input
    $json_data = file_get_contents('php://input');
    $route_data = json_decode($json_data, true);

    $vertrek = $route_data['start'] ?? '';
    $bestemming = $route_data['end'] ?? '';
    $afstand = $route_data['distance'] ?? ''; // Haal de afstand op

    if (!$vertrek || !$bestemming || !$afstand) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Ongeldige invoer.']);
        exit;
    }

    // Initialiseer de array voor de gebruiker als deze nog niet bestaat
    if (!isset($data[$gebruiker])) {
        $data[$gebruiker] = [];
    }

    $data[$gebruiker][] = [
        'vertrek' => $vertrek,
        'bestemming' => $bestemming,
        'afstand' => $afstand, // Sla de afstand op
        'datum' => date('Y-m-d H:i:s')
    ];

    if (file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT)) !== false) {
        echo json_encode(['success' => true, 'message' => 'Route succesvol opgeslagen.']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Fout bij het opslaan van de route.']);
    }

    exit;
}

// GET: Haal routes op voor de ingelogde gebruiker
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($data[$gebruiker])) {
        echo json_encode(['success' => true, 'routes' => $data[$gebruiker]]);
    } else {
        echo json_encode(['success' => true, 'routes' => []]); // Geen routes gevonden voor deze gebruiker
    }
    exit;
}

// Als een ander type verzoek wordt ontvangen
http_response_code(405); // Method Not Allowed
echo json_encode(['success' => false, 'message' => 'Methode niet toegestaan.']);

?>
