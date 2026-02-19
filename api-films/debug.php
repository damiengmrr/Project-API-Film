<?php
// debug.php — page de debug (HTML)
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>YFLIX — Debug</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;background:#0b0b0f;color:#f4f4f5}
    header{padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center}
    .logo{font-weight:950;letter-spacing:.1em;color:#e50914}
    .wrap{padding:18px;max-width:1000px;margin:0 auto}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
    @media(max-width:900px){.grid{grid-template-columns:1fr}}
    .card{border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(255,255,255,.03);padding:14px}
    h2{margin:0 0 10px;font-size:16px}
    code{background:rgba(255,255,255,.06);padding:2px 6px;border-radius:8px}
    a{color:#e50914;text-decoration:none;font-weight:800}
    a:hover{text-decoration:underline}
    ul{margin:8px 0 0;padding-left:18px}
    .pill{display:inline-block;padding:8px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#f4f4f5;font-weight:800;margin-right:8px}
    .ok{color:#36d399}
    .warn{color:#fbbf24}
    .muted{color:rgba(255,255,255,.65)}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  </style>
</head>
<body>
<header>
  <div class="logo">YFLIX</div>
  <div class="row">
    <a class="pill" href="/yflix.html">Ouvrir YFLIX</a>
    <a class="pill" href="/">Accueil</a>
  </div>
</header>

<div class="wrap">
  <div class="grid">

    <div class="card">
      <h2>Statut</h2>
      <div class="muted">Si tu vois cette page : le serveur PHP tourne ✅</div>
      <ul>
        <li>PHP : <code><?php echo phpversion(); ?></code></li>
        <li>Heure serveur : <code><?php echo date("Y-m-d H:i:s"); ?></code></li>
      </ul>
    </div>

    <div class="card">
      <h2>Routes API</h2>
      <ul>
        <li><code>GET /movies?type=popular</code></li>
        <li><code>GET /movies?type=top_rated</code></li>
        <li><code>GET /movies?type=upcoming</code></li>
        <li><code>GET /movies?type=now_playing</code></li>
        <li><code>GET /favorites</code></li>
        <li><code>POST /favorites</code></li>
      </ul>
    </div>

    <div class="card">
      <h2>Tests rapides</h2>
      <div class="row">
        <a class="pill" href="/movies?type=popular" target="_blank">popular</a>
        <a class="pill" href="/movies?type=top_rated" target="_blank">top_rated</a>
        <a class="pill" href="/movies?type=upcoming" target="_blank">upcoming</a>
        <a class="pill" href="/movies?type=now_playing" target="_blank">now_playing</a>
        <a class="pill" href="/favorites" target="_blank">GET favorites</a>
      </div>
      <p class="muted" style="margin-top:10px">
        Les liens ouvrent la réponse JSON dans un nouvel onglet.
      </p>
    </div>

    <div class="card">
      <h2>Favorites.json</h2>
      <?php
        $file = __DIR__ . "/favorites.json";
        if (!file_exists($file)) {
          echo '<div class="warn">favorites.json introuvable ❌</div>';
        } else {
          $content = file_get_contents($file);
          $arr = json_decode($content, true);
          $count = is_array($arr) ? count($arr) : 0;
          echo '<div class="ok">Fichier OK ✅</div>';
          echo '<div class="muted">Nombre de favoris : <code>' . $count . '</code></div>';
        }
      ?>
      <div class="row" style="margin-top:12px">
        <a class="pill" href="/debug/reset" onclick="return confirm('Reset favoris ?');">Reset favoris</a>
      </div>
      <p class="muted" style="margin-top:10px">
        Reset = remet <code>[]</code> dans favorites.json
      </p>
    </div>

  </div>

  <div class="card" style="margin-top:12px">
    <h2>Info</h2>
    <div class="muted">
      Page debug simple (HTML) pour vérifier :
      serveur, routes, réponses JSON, et fichier de favoris.
    </div>
  </div>
</div>
</body>
</html>