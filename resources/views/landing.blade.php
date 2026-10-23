
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Login Griya Lansia</title>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/landing.jsx'])
</head>
<body>
    <div id="landing-root"></div>
</body>
</html>
