<?php
require_once __DIR__ . '/controllers/MovieController.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($path === '/' || $path === '/index.php') {
    header("Location: /yflix.html");
    exit;
}

header("Content-Type: application/json; charset=utf-8");

if ($path === '/help') {
    echo json_encode([
        "status" => "ok",
        "routes" => [
            "GET /movies?type=popular" => "films TMDB",
            "POST /favorites" => "ajout favori (JSON: id, title)",
            "GET /favorites" => "liste favoris"
        ]
    ]);
    exit;
}

if ($path === '/movies' && $method === 'GET') {
    $type = $_GET['type'] ?? 'popular';
    MovieController::list($type);
    exit;
}

if ($path === '/favorites' && $method === 'POST') {
    MovieController::addFavorite();
    exit;
}

if ($path === '/favorites' && $method === 'GET') {
    MovieController::getFavorites();
    exit;
}

http_response_code(404);
echo json_encode(["status" => "error", "message" => "404 - route inconnue"]);