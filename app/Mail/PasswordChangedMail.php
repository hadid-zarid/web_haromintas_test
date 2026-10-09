<?php

namespace App\Mail;

use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Pemberitahuan ke pemilik akun bahwa kata sandinya baru saja diubah,
 * agar perubahan yang tidak sah bisa segera disadari.
 */
class PasswordChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public CarbonInterface $changedAt,
        public string $ipAddress,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Kata Sandi Akun Anda Telah Diubah - HARMONITAS Kanwil Kemenkum Riau',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password_changed',
            with: [
                'userName' => $this->userName,
                'waktu' => $this->changedAt->timezone(config('app.timezone'))->format('d-m-Y H:i:s T'),
                'ipAddress' => $this->ipAddress,
                'resetUrl' => route('password.request'),
            ],
        );
    }
}
