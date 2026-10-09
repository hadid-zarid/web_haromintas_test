<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Foto profil unggahan pengguna. Setiap file selalu di-decode lalu di-encode ulang
 * menjadi JPEG persegi kecil: membuang EXIF/GPS dan payload tersembunyi (polyglot),
 * dan nama file selalu acak — tidak ada input pengguna di path. Disimpan di disk
 * privat 'local' dan hanya disajikan lewat ProfilController::showAvatar.
 */
class AvatarService
{
    private const DISK = 'local';

    private const FOLDER = 'avatars/';

    private const UKURAN = 256;

    public function simpan(User $user, UploadedFile $file): void
    {
        $sumber = @imagecreatefromstring((string) file_get_contents($file->getRealPath()));

        if ($sumber === false) {
            throw ValidationException::withMessages(['avatar' => 'File gambar tidak dapat dibaca. Gunakan JPG atau PNG.']);
        }

        // Potong persegi dari tengah (cadangan bila yang diterima tidak persegi), lalu kecilkan.
        $lebar = imagesx($sumber);
        $tinggi = imagesy($sumber);
        $sisi = min($lebar, $tinggi);

        $hasil = imagecreatetruecolor(self::UKURAN, self::UKURAN);
        imagefill($hasil, 0, 0, imagecolorallocate($hasil, 255, 255, 255)); // latar PNG transparan
        imagecopyresampled(
            $hasil, $sumber,
            0, 0, intdiv($lebar - $sisi, 2), intdiv($tinggi - $sisi, 2),
            self::UKURAN, self::UKURAN, $sisi, $sisi,
        );

        ob_start();
        imagejpeg($hasil, null, 85);
        $jpeg = ob_get_clean();

        $path = self::FOLDER.Str::random(40).'.jpg';
        self::disk()->put($path, $jpeg);

        $lama = $user->avatar_path;
        $user->forceFill(['avatar_path' => $path])->save();
        $this->hapusFileLokal($lama);
    }

    /**
     * Hapus foto dan tandai agar login Google berikutnya tidak memasang foto Google lagi.
     */
    public function hapus(User $user): void
    {
        $lama = $user->avatar_path;
        $user->forceFill(['avatar_path' => null, 'avatar_google_aktif' => false])->save();
        $this->hapusFileLokal($lama);
    }

    /**
     * True bila avatar_path menunjuk file unggahan (bukan URL foto Google). Dicocokkan persis
     * dengan pola nama buatan simpan() agar path seperti "avatars/../.env" tidak pernah lolos.
     */
    public static function fileLokal(?string $path): bool
    {
        return $path !== null && preg_match('#^avatars/[A-Za-z0-9]{40}\.jpg$#', $path) === 1;
    }

    public static function disk(): FilesystemAdapter
    {
        return Storage::disk(self::DISK);
    }

    private function hapusFileLokal(?string $path): void
    {
        if (self::fileLokal($path)) {
            self::disk()->delete($path);
        }
    }
}
