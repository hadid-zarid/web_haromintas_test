<?php

namespace App\Http\Requests;

use App\Services\ChatbotService;
use Illuminate\Foundation\Http\FormRequest;

class ChatbotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:500'],
            'history' => ['nullable', 'array', 'max:'.ChatbotService::MAX_HISTORY],
            'history.*.role' => ['required', 'in:user,assistant'],
            'history.*.content' => ['required', 'string', 'max:2500'],
        ];
    }

    public function messages(): array
    {
        return [
            'message.required' => 'Tulis pertanyaan Anda terlebih dahulu.',
            'message.max' => 'Pertanyaan terlalu panjang (maksimal 500 karakter).',
        ];
    }
}
