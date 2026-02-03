<?php
require_once __DIR__ . '/../services/TMDBService.php';

class MovieController
{
    public static function list($type)
    {
        $movies = TMDBService::getMovies($type);

        if ($movies === null) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "TMDB KO"]);
            return;
        }

        echo json_encode($movies);
    }

    public static function addFavorite()
    {
        // Lire le body brut
        $raw = file_get_contents("php://input");

        // Si body vide erreur
        if (!$raw) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "body vide"]);
            return;
        }

        // Décoder JSON
        $data = json_decode($raw, true);

        // Si JSON invalide -> erreur
        if ($data === null) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "JSON invalide"]);
            return;
        }

        // Vérifier champs
        if (!isset($data["id"]) || !isset($data["title"])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "id/title manquant"]);
            return;
        }

        $file = __DIR__ . "/../favorites.json";

        // Charger favoris existants
        $favorites = [];
        if (file_exists($file)) {
            $content = file_get_contents($file);
            $decoded = json_decode($content, true);
            if (is_array($decoded)) $favorites = $decoded;
        }

        // Ajouter
        $favorites[] = [
            "id" => $data["id"],
            "title" => $data["title"]
        ];

        // Sauvegarder
        file_put_contents($file, json_encode($favorites, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        http_response_code(201);
        echo json_encode(["status" => "ok", "message" => "favori ajouté"]);
    }

    public static function getFavorites()
    {
        $file = __DIR__ . "/../favorites.json";

        if (!file_exists($file)) {
            echo json_encode([]);
            return;
        }

        $content = file_get_contents($file);
        $favorites = json_decode($content, true);

        if (!is_array($favorites)) $favorites = [];

        echo json_encode($favorites);
    }
}