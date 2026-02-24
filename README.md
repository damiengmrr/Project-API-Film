# YFLIX

## À propos du projet

Yflix est une application web développée pour créer et consommer une API REST dédiée à la gestion de films.

L’idée derrière ce projet n’était pas seulement d’afficher une liste de films, mais surtout de travailler une structure backend propre en PHP, avec une séparation claire entre la logique métier, les routes et la configuration.  
Je voulais quelque chose de structuré, maintenable et évolutif, comme dans un vrai projet.

---

## Objectifs

- Construire une API REST en PHP
- Structurer le backend avec une architecture claire
- Manipuler des réponses JSON propres et cohérentes
- Connecter un frontend simple à une API
- Poser des bases solides pour des évolutions futures

---

## Stack utilisée

### Backend

- PHP 8+
- Architecture REST
- Réponses JSON standardisées

### Frontend

- HTML5
- CSS3
- JavaScript (Fetch API)

---

## Structure du projet

```
PROJECT-API-FILM/
│
├── api-films/
│   ├── config/
│   │   └── config.php
│   │
│   ├── controllers/
│   │   └── MovieController.php
│   │
│   ├── services/
│   │   └── TMDBService.php
│   │
│   ├── debug.php
│   ├── favorites.json
│   └── index.php
│
├── package-lock.json
├── yflix.css
├── yflix.html
├── yflix.js
└── README.md
```

---

## Fonctionnalités actuelles

- Récupération de la liste des films
- Consultation du détail d’un film
- Recherche par titre
- Réponses JSON structurées
- Consommation de l’API via JavaScript

---

## Lancer le projet

Depuis la racine du projet :

```
php -S localhost:8000
```

Puis accéder à :

```
http://localhost:8000/yflix.html
```

---

## Exemples d’endpoints

| Méthode | Endpoint | Description |
|----------|----------|--------------|
| GET | /api/films | Liste complète |
| GET | /api/films?id=1 | Détail d’un film |
| GET | /api/search?title=matrix | Recherche par titre |

---

## Bonnes pratiques

- Validation des paramètres
- Format de réponse homogène
- Gestion des erreurs HTTP
- Structure prête à intégrer une base de données

---

## Auteur

Damien Gamarra