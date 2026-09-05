<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $judul }} - HARMONITAS</title>
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
            max-width: 600px;
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
            padding: 34px 24px 26px;
            text-align: center;
            border-bottom: 4px solid #FFC800;
        }
        .logo-box {
            display: inline-block;
            background: #ffffff;
            padding: 10px;
            border-radius: 16px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
            margin-bottom: 12px;
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
        .badge-bar {
            background-color: #EEF3FF;
            border-bottom: 1px solid #D0DCFF;
            padding: 10px 24px;
            text-align: center;
            font-size: 11px;
            font-weight: 800;
            color: #303661;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .content {
            padding: 30px 28px;
            line-height: 1.65;
            font-size: 13.5px;
            color: #3D4457;
        }
        .greeting {
            font-size: 15.5px;
            font-weight: 800;
            color: #101B4F;
            margin-bottom: 4px;
        }
        .role-tag {
            display: inline-block;
            background: #F0F2F9;
            color: #303661;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 18px;
        }
        .alert-card {
            background-color: #FFFDF0;
            border: 1px solid #FFE082;
            border-left: 4px solid #FFC800;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 24px;
        }
        .alert-title {
            font-size: 14px;
            font-weight: 800;
            color: #8C6200;
            margin-bottom: 6px;
        }
        .alert-desc {
            font-size: 13px;
            color: #4A4533;
            margin: 0;
            line-height: 1.55;
        }
        .details-card {
            background-color: #F8F9FD;
            border: 1px solid #E2E6EF;
            border-radius: 14px;
            padding: 20px;
            margin-bottom: 26px;
        }
        .details-header {
            font-size: 12px;
            font-weight: 800;
            color: #101B4F;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 14px;
            padding-bottom: 8px;
            border-bottom: 1px solid #E2E6EF;
        }
        .detail-row {
            display: flex;
            margin-bottom: 10px;
            font-size: 12.5px;
        }
        .detail-row:last-child {
            margin-bottom: 0;
        }
        .detail-label {
            width: 140px;
            color: #718096;
            font-weight: 600;
            flex-shrink: 0;
        }
        .detail-value {
            color: #101B4F;
            font-weight: 700;
            flex: 1;
        }
        .btn-wrapper {
            text-align: center;
            margin: 28px 0 16px;
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
        .url-fallback {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px dashed #E2E6EF;
            font-size: 11px;
            color: #718096;
            word-break: break-all;
        }
        .url-fallback a {
            color: #303661;
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

        <!-- BADGE SUB-HEADER -->
        <div class="badge-bar">
            {{ $badgeText ?? 'Pemberitahuan Sistem Alur Kerja Harmonisasi' }}
        </div>
        
        <!-- CONTENT BODY -->
        <div class="content">
            <div class="greeting">Yth. Bapak/Ibu {{ $user->nama ?? $user->name ?? 'Petugas Kedinasan' }}</div>
            <div class="role-tag">
                {{ $user->role ?? $user->roleRelation->nama_role ?? 'Petugas HARMONITAS' }}
                @if(isset($user->timKerja) && $user->timKerja)
                    &bull; {{ $user->timKerja->nama_tim_kerja }}
                @endif
            </div>

            <!-- ALERT HEADLINE & MESSAGE -->
            <div class="alert-card">
                <div class="alert-title">{{ $judul }}</div>
                <p class="alert-desc">{{ $pesan }}</p>
            </div>

            <!-- REGULATION DETAILS TABLE -->
            <div class="details-card">
                <div class="details-header">Ringkasan Berkas Permohonan Harmonisasi</div>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
                    <tr>
                        <td style="padding: 5px 0; color: #718096; width: 140px; font-weight: 600; vertical-align: top;">Judul Rancangan</td>
                        <td style="padding: 5px 0; color: #101B4F; font-weight: 700;">{{ $rancangan->judul_rancangan ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #718096; font-weight: 600;">Nomor Berkas</td>
                        <td style="padding: 5px 0; color: #303661; font-weight: 800;">{{ $rancangan->nomor_regulasi ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #718096; font-weight: 600;">Pemerintah Daerah</td>
                        <td style="padding: 5px 0; color: #101B4F; font-weight: 700;">{{ $rancangan->kabupaten->nama_kabupaten ?? $rancangan->kabupaten_nama ?? 'Pemerintah Daerah' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #718096; font-weight: 600;">Jenis Permohonan</td>
                        <td style="padding: 5px 0; color: #101B4F; font-weight: 700;">{{ $rancangan->jenisRegulasi->nama_jenis ?? 'Peraturan Daerah' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #718096; font-weight: 600;">Status Terkini</td>
                        <td style="padding: 5px 0; color: #2E7D32; font-weight: 800;">{{ $rancangan->status->nama_status ?? 'Dalam Proses' }}</td>
                    </tr>
                </table>
            </div>

            <!-- CALL TO ACTION BUTTON -->
            <div class="btn-wrapper">
                <a href="{{ $actionUrl }}" class="btn">Buka &amp; Tinjau Berkas di HARMONITAS &rarr;</a>
            </div>

            <!-- URL FALLBACK -->
            <div class="url-fallback">
                Jika tombol di atas tidak dapat diklik langsung, Anda dapat menyalin dan membuka tautan berikut pada peramban web:<br>
                <a href="{{ $actionUrl }}">{{ $actionUrl }}</a>
            </div>
        </div>
        
        <!-- FOOTER -->
        <div class="footer">
            <span class="footer-highlight">HARMONITAS &bull; Kantor Wilayah Kementerian Hukum Provinsi Riau</span><br>
            Jl. Jenderal Sudirman No. 233, Pekanbaru, Riau 28111<br>
            Email otomatis dari Sistem Layanan Digital HARMONITAS. Mohon tidak membalas email ini.
        </div>
    </div>
</body>
</html>
