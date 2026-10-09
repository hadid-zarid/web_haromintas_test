<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kata Sandi Diubah - HARMONITAS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        body, table, td, p, a, h1, div, span {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        }
        body {
            background-color: #F4F5F9;
            margin: 0;
            padding: 24px 12px;
            color: #20283D;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 580px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #E2E6EF;
            box-shadow: 0 10px 30px rgba(30, 39, 89, 0.08);
        }
        .header {
            background-color: #101B4F;
            background-image: linear-gradient(135deg, #101B4F 0%, #2C3154 100%);
            color: #ffffff;
            padding: 36px 24px 28px;
            text-align: center;
            position: relative;
            border-bottom: 4px solid #FFC800;
        }
        .logo-box {
            display: inline-block;
            background: #ffffff;
            padding: 10px;
            border-radius: 16px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
            margin-bottom: 14px;
        }
        .logo-img {
            max-height: 48px;
            width: auto;
            display: block;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #FFFFFF;
        }
        .header p {
            margin: 4px 0 0 0;
            font-size: 11px;
            color: #FFC800;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .content {
            padding: 32px 30px;
            line-height: 1.65;
            font-size: 13.5px;
            color: #3D4457;
        }
        .greeting {
            font-size: 16px;
            font-weight: 800;
            color: #101B4F;
            margin-bottom: 12px;
        }
        .btn-wrapper {
            text-align: center;
            margin: 28px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #FFD54F 0%, #FFB300 100%);
            color: #101B4F !important;
            text-decoration: none;
            padding: 14px 34px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 13px;
            letter-spacing: 0.3px;
            box-shadow: 0 4px 14px rgba(255, 179, 0, 0.4);
            transition: all 0.2s ease;
        }
        .info-box {
            background-color: #F8F9FD;
            border: 1px solid #E2E6EF;
            border-left: 4px solid #FFC800;
            border-radius: 12px;
            padding: 16px 18px;
            font-size: 12px;
            color: #4A5568;
            margin-top: 24px;
        }
        .info-box strong {
            color: #101B4F;
            display: block;
            margin-bottom: 6px;
        }
        .url-box {
            margin-top: 24px;
            padding-top: 18px;
            border-top: 1px dashed #E2E6EF;
            font-size: 11.5px;
            color: #718096;
            word-break: break-all;
        }
        .url-box a {
            color: #2C3154;
            font-weight: 600;
        }
        .footer {
            background-color: #F8F9FD;
            padding: 22px 24px;
            text-align: center;
            font-size: 11px;
            color: #718096;
            border-top: 1px solid #E2E6EF;
            line-height: 1.5;
        }
        .footer-highlight {
            color: #101B4F;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER WITH LOGO -->
        <div class="header">
            <div class="logo-box">
                @if(isset($message) && method_exists($message, 'embed') && file_exists(public_path('LOGO HARMONITAS.png')))
                    <img src="{{ $message->embed(public_path('LOGO HARMONITAS.png')) }}" alt="Logo HARMONITAS" class="logo-img">
                @elseif(file_exists(public_path('LOGO HARMONITAS.png')))
                    <img src="{{ asset('LOGO HARMONITAS.png') }}" alt="Logo HARMONITAS" class="logo-img">
                @else
                    <div style="font-weight: 900; color: #101B4F; font-size: 18px; padding: 4px 10px;">HARMONITAS</div>
                @endif
            </div>
            <h1>HARMONITAS</h1>
            <p>Harmonisasi dan Fasilitasi Ranperda &amp; Ranperkada Tuntas</p>
        </div>
        
        <!-- CONTENT BODY -->
        <div class="content">
            <div class="greeting">Halo, {{ $userName }}</div>
            <p>
                Kata sandi akun Anda di sistem <strong>HARMONITAS Kanwil Kemenkum Riau</strong> baru saja diubah melalui halaman Profil Saya.
            </p>

            <div class="info-box">
                <strong>Detail Perubahan:</strong>
                <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
                    <li>Waktu: <strong>{{ $waktu }}</strong></li>
                    <li>Alamat IP: <strong>{{ $ipAddress }}</strong></li>
                    <li>Sesi login di perangkat lain telah dikeluarkan secara otomatis.</li>
                </ul>
            </div>

            <p style="margin-top: 24px;">
                Jika perubahan ini <strong>bukan</strong> dilakukan oleh Anda, segera amankan akun dengan mengatur ulang kata sandi lalu hubungi Administrator Kanwil:
            </p>

            <div class="btn-wrapper">
                <a href="{{ $resetUrl }}" class="btn">Reset Kata Sandi Sekarang &rarr;</a>
            </div>

            <div class="url-box">
                Jika perubahan ini memang Anda lakukan, abaikan email ini.
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <span class="footer-highlight">HARMONITAS &bull; Kantor Wilayah Kementerian Hukum Provinsi Riau</span><br>
            Jl. Jenderal Sudirman No. 233, Pekanbaru, Riau 28111<br>
            &copy; {{ date('Y') }} Kanwil Kemenkum Riau. Hak Cipta Dilindungi.
        </div>
    </div>
</body>
</html>
