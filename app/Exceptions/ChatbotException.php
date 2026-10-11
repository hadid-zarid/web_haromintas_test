<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Kegagalan chatbot yang aman ditampilkan ke pengunjung (pesan sudah berbahasa Indonesia
 * dan tidak memuat detail teknis atau rahasia).
 */
class ChatbotException extends RuntimeException
{
    public function __construct(string $message, public readonly int $status = 503)
    {
        parent::__construct($message);
    }
}
