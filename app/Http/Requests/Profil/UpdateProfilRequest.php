<?php

namespace App\Http\Requests\Profil;

use App\Rules\NoHtmlContent;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Data diri yang boleh diubah pengguna sendiri. Email, role, status, dan unit
 * sengaja tidak ada di sini — hanya Admin yang boleh mengubahnya.
 */
class UpdateProfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:150', new NoHtmlContent],
            'no_hp' => ['nullable', 'string', 'max:13', 'regex:/^[0-9]+$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama lengkap wajib diisi.',
            'nama.max' => 'Nama lengkap maksimal 150 karakter.',
            'no_hp.max' => 'Nomor WhatsApp / HP maksimal 13 digit angka.',
            'no_hp.regex' => 'Nomor WhatsApp / HP hanya boleh berupa digit angka.',
        ];
    }
}
