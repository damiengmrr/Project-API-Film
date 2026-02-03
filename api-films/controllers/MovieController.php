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
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "JSON invalide"]);
            return;
        }

        if (!isset($data["id"]) || !isset($data["title"])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "id/title manquant"]);
            return;
        }

        $file = __DIR__ . "/../favorites.json";

        $favorites = [];
        if (file_exists($file)) {
            $content = file_get_contents($file);
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                $favorites = $decoded;
            }
        }

        $favorites[] = [
            "id" => $data["id"],
            "title" => $data["title"]
        ];

        file_put_contents($file, json_encode($favorites, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        http_response_code(201);
        echo json_encode(["status" => "ok", "message" => "favori ajouté"]);
    }
}