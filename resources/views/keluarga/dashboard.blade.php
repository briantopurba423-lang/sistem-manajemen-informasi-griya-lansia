<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Keluarga - Griya Lansia</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/js/keluarga/dashboard.jsx'])
</head>
<body>
    <div id="keluarga-root"></div>
</body>
</html>
