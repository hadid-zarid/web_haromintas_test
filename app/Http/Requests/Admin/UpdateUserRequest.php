<?php

namespace App\Http\Requests\Admin;

use App\Rules\NoHtmlContent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name') && ! $this->has('nama')) {
            $this->merge(['nama' => $this->input('name')]);
        }

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
        $userId = $this->route('user') ? $this->route('user')->user_id : $this->input('user_id', $this->input('id'));

        return [
            'nama' => ['required', 'string', 'max:150', new NoHtmlContent()],
            'email' => ['required', 'string', 'email', 'max:150', Rule::unique('user', 'email')->ignore($userId, 'user_id')],
            'password' => [
                'nullable',
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
            'status' => ['required', 'string', Rule::in(['ACTIVE', 'INACTIVE'])],
            'tim_kerja_id' => ['nullable', 'required_if:role_id,2', 'exists:tim_kerja,tim_kerja_id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama pengguna wajib diisi.',
            'email.required' => 'Email kedinasan wajib diisi.',
            'email.unique' => 'Email ini sudah digunakan oleh akun lain.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'nip.max' => 'NIP pegawai maksimal 18 digit angka.',
            'nip.regex' => 'NIP pegawai hanya boleh berupa digit angka.',
            'no_hp.max' => 'Nomor WhatsApp / HP maksimal 13 digit angka.',
            'no_hp.regex' => 'Nomor WhatsApp / HP hanya boleh berupa digit angka.',
            'role_id.required' => 'Hak akses / role akun wajib dipilih.',
            'status.required' => 'Status akun wajib ditentukan.',
            'tim_kerja_id.required_if' => 'Untuk role Tim Kerja Kanwil, unit Tim Kerja wajib dipilih.',
        ];
    }
}
