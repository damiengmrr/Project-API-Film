# Projet API Film (PHP) — TP API REST

Petite API REST en PHP :
- récupère des films depuis l’API TMDB
- expose des endpoints REST (GET)
- permet d’ajouter des favoris (POST) stockés dans un fichier JSON

---

## Pré-requis
- PHP 8+
- Une clé API TMDB

---

## Structure du projet

api-films/
- index.php
- favorites.json
- config/config.php
- services/TMDBService.php
- controllers/MovieController.php

---

## Configuration TMDB
Dans `config/config.php`, mettre votre clé :

```php
<?php
define('TMDB_API_KEY', 'VOTRE_CLE_API_TMDB');
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');