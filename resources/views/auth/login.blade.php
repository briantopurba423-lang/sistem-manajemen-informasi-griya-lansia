<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Griya Lansia</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        input, button, select, textarea { font-family: inherit; }
        @media (max-width: 768px) {
            .login-left-panel { display: none !important; }
        }
    </style>
    @vite(['resources/css/app.css', 'resources/js/auth/login.jsx'])
</head>
<body>
    <div id="login-root"></div>
</body>
</html>
