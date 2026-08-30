<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="{{ asset('LOGO HARMONITAS.png') }}" />
    <link rel="shortcut icon" type="image/png" href="{{ asset('LOGO HARMONITAS.png') }}" />
    <title>@yield('title') - HARMONITAS Kanwil Kemenkumham Riau</title>

    <!-- Google Fonts: Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        body {
            background-color: #ffffff;
            color: #1e293b;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow-x: hidden;
            position: relative;
        }
        /* Background Grid & Ambient Glow */
        .ambient-glow {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        }
        .grid-pattern {
            position: absolute;
            inset: 0;
            opacity: 0.045;
            background-image: linear-gradient(to right, #2B3056 1px, transparent 1px),
                              linear-gradient(to bottom, #2B3056 1px, transparent 1px);
            background-size: 32px 32px;
        }
        .glow-warmth {
            position: absolute;
            top: -64px;
            right: 25%;
            width: 384px;
            height: 384px;
            background: radial-gradient(circle, rgba(255, 216, 43, 0.14) 0%, rgba(255, 255, 255, 0) 70%);
            border-radius: 50%;
            filter: blur(48px);
        }
        /* Header */
        header {
            position: relative;
            z-index: 10;
            border-bottom: 1px solid #e2e8f0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            padding: 0.85rem 1.5rem;
        }
        .header-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .brand-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            color: #2B3056;
        }
        .brand-logo-box {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .brand-logo-box img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .brand-title {
            font-size: 1.05rem;
            font-weight: 800;
            letter-spacing: 0.03em;
            color: #2B3056;
        }
        .badge-kanwil {
            font-size: 8.5px;
            font-weight: 700;
            background: #FFF9DF;
            color: #2B3056;
            border: 1px solid rgba(255, 216, 43, 0.6);
            padding: 2px 6px;
            border-radius: 999px;
            text-transform: uppercase;
            margin-left: 4px;
            vertical-align: middle;
        }
        .brand-sub {
            font-size: 10px;
            color: #64748b;
        }
        /* Main Container */
        main {
            position: relative;
            z-index: 10;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2.5rem 1.25rem;
        }
        .content-box {
            max-width: 720px;
            width: 100%;
            text-align: center;
        }
        /* Code Display */
        .institution-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            background: rgba(255, 255, 255, 0.95);
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #2B3056;
            margin-bottom: 1rem;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .status-number {
            font-size: clamp(5rem, 15vw, 7.5rem);
            font-weight: 900;
            line-height: 1;
            background: linear-gradient(180deg, #2B3056 0%, #3A4070 50%, #2B3056 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.04em;
        }
        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 14px;
            border-radius: 999px;
            font-size: 11.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.5rem;
            background: #FFF9DF;
            color: #854d0e;
            border: 1px solid #fde047;
        }
        .pulse-dot {
            width: 7px;
            height: 7px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
        }
        /* Text */
        h1 {
            font-size: clamp(1.35rem, 3vw, 1.85rem);
            font-weight: 800;
            color: #2B3056;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            line-height: 1.25;
        }
        p.desc {
            font-size: 13px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 1.75rem;
            max-width: 560px;
            margin-left: auto;
            margin-right: auto;
        }
        /* Buttons */
        .btn-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 1.75rem;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.7rem 1.4rem;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn-primary {
            background: linear-gradient(90deg, #FFD82B 0%, #FFB943 100%);
            color: #2B3056;
            border: none;
            box-shadow: 0 2px 8px rgba(255, 216, 43, 0.35);
        }
        .btn-primary:hover {
            filter: brightness(1.06);
            transform: translateY(-1px);
        }
        .btn-secondary {
            background: #ffffff;
            color: #334155;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .btn-secondary:hover {
            background: #f8fafc;
            color: #2B3056;
            border-color: #cbd5e1;
            transform: translateY(-1px);
        }
        /* Helpful Card */
        .suggestion-card {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 1.25rem;
            text-align: left;
            margin: 0 auto;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .suggestion-card h3 {
            font-size: 11.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #2B3056;
            margin-bottom: 0.6rem;
        }
        .suggestion-list {
            list-style: none;
            font-size: 12px;
            color: #475569;
            line-height: 1.6;
        }
        .suggestion-list li {
            position: relative;
            padding-left: 1.2rem;
            margin-bottom: 0.35rem;
        }
        .suggestion-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #eab308;
            font-size: 16px;
            line-height: 1;
        }
        /* Footer */
        footer {
            position: relative;
            z-index: 10;
            border-top: 1px solid #e2e8f0;
            background: #ffffff;
            padding: 1rem 1.5rem;
            text-align: center;
            font-size: 11px;
            color: #64748b;
        }
        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
        }
        @media (min-width: 640px) {
            .footer-container {
                flex-direction: row;
            }
        }
    </style>
</head>
<body>
    <div class="ambient-glow">
        <div class="grid-pattern"></div>
        <div class="glow-warmth"></div>
    </div>

    <header>
        <div class="header-container">
            <a href="{{ url('/') }}" class="brand-link">
                <div class="brand-logo-box">
                    <img src="{{ asset('LOGO HARMONITAS.png') }}" alt="Logo HARMONITAS" onerror="this.style.display='none'">
                </div>
                <div>
                    <div>
                        <span class="brand-title">HARMONITAS</span>
                        <span class="badge-kanwil">Riau</span>
                    </div>
                    <div class="brand-sub">Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas</div>
                </div>
            </a>

            <div>
                @auth
                    <a href="{{ url('/home') }}" class="btn btn-primary" style="padding: 0.45rem 0.95rem; font-size: 11.5px;">
                        Ke Dashboard
                    </a>
                @else
                    <a href="{{ url('/login') }}" class="btn btn-primary" style="padding: 0.45rem 0.95rem; font-size: 11.5px;">
                        Masuk Petugas
                    </a>
                @endauth
            </div>
        </div>
    </header>

    <main>
        <div class="content-box">
            <div class="institution-badge">
                Kantor Wilayah Kementerian Hukum Riau
            </div>

            <div class="code-wrapper">
                <div class="status-number">@yield('code')</div>
                <div>
                    <div class="status-pill">
                        <span class="pulse-dot"></span>
                        <span>@yield('badge', 'Status Galat')</span>
                    </div>
                </div>
            </div>

            <h1>@yield('heading')</h1>
            <p class="desc">@yield('message')</p>

            <div class="btn-group">
                <button type="button" onclick="window.history.back()" class="btn btn-secondary">
                    ← Halaman Sebelumnya
                </button>
                <a href="{{ url('/') }}" class="btn btn-primary">
                    Ke Beranda Utama
                </a>
                <button type="button" onclick="window.location.reload()" class="btn btn-secondary" title="Segarkan">
                    ↻ Muat Ulang
                </button>
            </div>

            <div class="suggestion-card">
                <h3>💡 Rekomendasi Solusi</h3>
                <ul class="suggestion-list">
                    @yield('suggestions')
                </ul>
            </div>
        </div>
    </main>

    <footer>
        <div class="footer-container">
            <div>Kantor Wilayah Kementerian Hukum Riau</div>
            <div>&copy; {{ date('Y') }} HARMONITAS • Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas</div>
        </div>
    </footer>
</body>
</html>
