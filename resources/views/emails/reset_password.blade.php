<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Kata Sandi - HARMONITAS</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #F4F5F9;
            margin: 0;
            padding: 0;
            color: #3D3D3A;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #E2E2DC;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .header {
            background-color: #2C3154;
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
            border-bottom: 3px solid #FFC800;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 1px;
        }
        .header p {
            margin: 6px 0 0 0;
            font-size: 12px;
            color: #FFC800;
            font-weight: 700;
        }
        .content {
            padding: 32px 28px;
            line-height: 1.6;
            font-size: 14px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 800;
            color: #1A1A5E;
            margin-bottom: 12px;
        }
        .btn-wrapper {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #FFD54F 0%, #FFB300 100%);
            color: #1A1A5E;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 900;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(255, 200, 0, 0.4);
        }
        .info-box {
            background-color: #F8F8F5;
            border: 1px solid #E2E2DC;
            border-radius: 12px;
            padding: 16px;
            font-size: 12px;
            color: #555555;
            margin-top: 24px;
        }
        .footer {
            background-color: #F8F8F5;
            padding: 20px;
            text-align: center;
            font-size: 11px;
            color: #888888;
            border-top: 1px solid #E2E2DC;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HARMONITAS</h1>
            <p>Kantor Wilayah Kementerian Hukum Provinsi Riau</p>
        </div>
        
        <div class="content">
            <div class="greeting">Halo, {{ $userName }}</div>
            <p>
                Kami menerima permintaan untuk melakukan pemulihan kata sandi (*reset password*) untuk akun kedinasan Anda di sistem <strong>HARMONITAS</strong>.
            </p>
            <p>
                Silakan klik tombol di bawah ini untuk membuat kata sandi baru Anda:
            </p>
            
            <div class="btn-wrapper">
                <a href="{{ $resetUrl }}" class="btn">Reset Kata Sandi Anda &rarr;</a>
            </div>
            
            <div class="info-box">
                <strong>Catatan Keamanan:</strong>
                <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                    <li>Tautan ini berlaku selama 60 menit.</li>
                    <li>Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini dan kata sandi Anda akan tetap aman.</li>
                </ul>
            </div>
            
            <p style="margin-top: 24px; font-size: 12px; color: #666666;">
                Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut di peramban Anda:<br>
                <a href="{{ $resetUrl }}" style="color: #1A1A5E; word-break: break-all;">{{ $resetUrl }}</a>
            </p>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} HARMONITAS - Kanwil Kemenkumham Riau. Hak Cipta Dilindungi Undang-Undang.
        </div>
    </div>
</body>
</html>
