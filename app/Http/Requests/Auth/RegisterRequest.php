<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'nip' => ['nullable', 'string', 'max:30'],
            'jabatan' => ['nullable', 'string', 'max:100'],
            'no_hp' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'string', Rule::in(['BIRO_HUKUM', 'POKJA', 'PIMPINAN'])],
            'pokja_id' => ['nullable', 'required_if:role,POKJA', 'exists:pokjas,id'],
            'wilayah_id' => ['nullable', 'required_if:role,BIRO_HUKUM', 'exists:wilayahs,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap beserta gelar wajib diisi.',
            'email.required' => 'Email kedinasan wajib diisi.',
            'email.unique' => 'Email ini sudah terdaftar di sistem HARMONITAS.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'role.required' => 'Silakan pilih peran pengguna.',
            'pokja_id.required_if' => 'Silakan pilih Tim Pokja untuk peran Pokja Kanwil.',
            'wilayah_id.required_if' => 'Silakan pilih Pemerintah Daerah untuk peran Biro/Bagian Hukum.',
        ];
    }
}
