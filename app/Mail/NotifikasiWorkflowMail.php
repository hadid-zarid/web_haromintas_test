<?php

namespace App\Mail;

use App\Models\RancanganRegulasi;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotifikasiWorkflowMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public RancanganRegulasi $rancangan;
    public string $judul;
    public string $pesan;
    public string $actionUrl;
    public string $badgeText;

    /**
     * Create a new message instance.
     */
    public function __construct(
        User $user,
        RancanganRegulasi $rancangan,
        string $judul,
        string $pesan,
        ?string $actionUrl = null,
        ?string $badgeText = null
    ) {
        $this->user = $user;
        $this->rancangan = $rancangan;
        $this->judul = $judul;
        $this->pesan = $pesan;
        $this->actionUrl = $actionUrl ?? url("/peraturan/{$rancangan->rancangan_id}");
        $this->badgeText = $badgeText ?? 'Pemberitahuan Alur Kerja';
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[HARMONITAS] {$this->judul} - {$this->rancangan->nomor_regulasi}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notifikasi_alur_kerja',
            with: [
                'user' => $this->user,
                'rancangan' => $this->rancangan,
                'judul' => $this->judul,
                'pesan' => $this->pesan,
                'actionUrl' => $this->actionUrl,
                'badgeText' => $this->badgeText,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
