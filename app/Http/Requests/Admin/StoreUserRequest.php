<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    protected function prepareForValidation(): void
    {
        // Support name / nama
        if ($this->has('name') && ! $this->has('nama')) {
            $this->merge(['nama' => $this->input('name')]);
        }

        // Convert role string to role_id if string passed
        if ($this->has('role')) {
            $roleStr = strtoupper($this->input('role'));
            $roleId = match ($roleStr) {
                'ADMIN' => 1,
                'TIM_KERJA', 'POKJA' => 2,
                'BIRO_HUKUM' => 3,
                'PIMPINAN' => 4,
                default => (int) $this->input('role'),
            };
            $this->merge(['role_id' => $roleId]);
        }
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:150'],
            'email' => ['required', 'string', 'email', 'max:150', 'unique:user,email'],
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'nip' => ['nullable', 'string', 'max:18', 'regex:/^[0-9]+$/'],
            'no_hp' => ['nullable', 'string', 'max:13', 'regex:/^[0-9]+$/'],
            'role_id' => ['required', 'integer', Rule::in([1, 2, 3, 4])],
            'tim_kerja_id' => ['nullable', 'required_if:role_id,2', 'exists:tim_kerja,tim_kerja_id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama pengguna wajib diisi.',
            'email.required' => 'Email kedinasan wajib diisi.',
            'email.unique' => 'Email ini sudah digunakan oleh akun lain.',
            'password.required' => 'Kata sandi / password akun wajib ditentukan.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'nip.max' => 'NIP pegawai maksimal 18 digit angka.',
            'nip.regex' => 'NIP pegawai hanya boleh berupa digit angka.',
            'no_hp.max' => 'Nomor WhatsApp / HP maksimal 13 digit angka.',
            'no_hp.regex' => 'Nomor WhatsApp / HP hanya boleh berupa digit angka.',
            'role_id.required' => 'Hak akses / role akun wajib dipilih.',
            'tim_kerja_id.required_if' => 'Untuk role Tim Kerja Kanwil, unit Tim Kerja wajib dipilih.',
        ];
    }
}
