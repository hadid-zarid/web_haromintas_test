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
            background-color: #101B4F;
            color: #F8FAFC;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow-x: hidden;
            position: relative;
        }
        /* Background Glow & Pattern */
        .ambient-glow {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        }
        .glow-1 {
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 400px;
            background: rgba(58, 64, 112, 0.3);
            border-radius: 50%;
            filter: blur(100px);
        }
        .glow-2 {
            position: absolute;
            top: 25%;
            right: -50px;
            width: 300px;
            height: 300px;
            background: rgba(255, 216, 43, 0.08);
            border-radius: 50%;
            filter: blur(90px);
        }
        .grid-pattern {
            position: absolute;
            inset: 0;
            opacity: 0.035;
            background-image: radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0);
            background-size: 32px 32px;
        }
        /* Header */
        header {
            position: relative;
            z-index: 10;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(16, 27, 79, 0.7);
            backdrop-filter: blur(12px);
            padding: 1rem 1.5rem;
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
            color: #fff;
        }
        .brand-logo-box {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 4px;
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
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 0.05em;
        }
        .badge-kanwil {
            font-size: 9px;
            font-weight: 700;
            background: #FFD82B;
            color: #101B4F;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
            margin-left: 6px;
            vertical-align: middle;
        }
        .brand-sub {
            font-size: 11px;
            color: #94A3B8;
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
            max-width: 700px;
            width: 100%;
            text-align: center;
        }
        /* Code Display */
        .code-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 1.5rem;
        }
        .status-number {
            font-size: clamp(5rem, 15vw, 8rem);
            font-weight: 900;
            line-height: 1;
            background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, rgba(148, 163, 184, 0.3) 100%);
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
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-top: 0.5rem;
            background: rgba(255, 216, 43, 0.1);
            color: #FFD82B;
            border: 1px solid rgba(255, 216, 43, 0.3);
            backdrop-filter: blur(8px);
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
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
            font-size: clamp(1.25rem, 3vw, 1.85rem);
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 0.75rem;
            line-height: 1.3;
        }
        p.desc {
            font-size: 13px;
            color: #94A3B8;
            line-height: 1.6;
            margin-bottom: 2rem;
            max-width: 540px;
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
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.4rem;
            border-radius: 12px;
            font-size: 12.5px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn-primary {
            background: linear-gradient(90deg, #FFD82B 0%, #FFB943 100%);
            color: #101B4F;
            border: none;
            box-shadow: 0 4px 14px rgba(255, 216, 43, 0.25);
        }
        .btn-primary:hover {
            filter: brightness(1.08);
            transform: translateY(-1px);
        }
        .btn-secondary {
            background: rgba(255, 255, 255, 0.08);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.14);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
        /* Helpful Card */
        .suggestion-card {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 1.25rem;
            text-align: left;
            margin: 0 auto;
            backdrop-filter: blur(10px);
        }
        .suggestion-card h3 {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #FFD82B;
            margin-bottom: 0.6rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .suggestion-list {
            list-style: none;
            font-size: 12px;
            color: #94A3B8;
            line-height: 1.6;
        }
        .suggestion-list li {
            position: relative;
            padding-left: 1.2rem;
            margin-bottom: 0.4rem;
        }
        .suggestion-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #FFD82B;
            font-size: 16px;
            line-height: 1;
        }
        /* Footer */
        footer {
            position: relative;
            z-index: 10;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(16, 27, 79, 0.8);
            padding: 1rem 1.5rem;
            text-align: center;
            font-size: 11px;
            color: #64748B;
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
        <div class="glow-1"></div>
        <div class="glow-2"></div>
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
                        <span class="badge-kanwil">Kanwil Riau</span>
                    </div>
                    <div class="brand-sub">Harmonisasi Ranperda & Ranperkada Terpadu</div>
                </div>
            </a>

            <div>
                <a href="{{ url('/login') }}" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 11.5px;">
                    Masuk Akun
                </a>
            </div>
        </div>
    </header>

    <main>
        <div class="content-box">
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
            <div>Kantor Wilayah Kementerian Hukum dan HAM Riau</div>
            <div>&copy; {{ date('Y') }} HARMONITAS. Hak Cipta Dilindungi.</div>
        </div>
    </footer>
</body>
</html>
