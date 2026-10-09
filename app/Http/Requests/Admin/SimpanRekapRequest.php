<?php

namespace App\Http\Requests\Admin;

use App\Models\Kabupaten;
use App\Rules\NoHtmlContent;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Angka rekap ProPem & Progsun satu tahun untuk seluruh wilayah, diisi manual oleh Admin.
 * Harmonisasi boleh melebihi target (surplus), sesuai rekap resmi.
 */
class SimpanRekapRequest extends FormRequest
{
    public const KOLOM_ANGKA = ['propem', 'harm_ranperda', 'progsun', 'harm_ranperkada'];

    public function authorize(): bool
    {
        return (bool) $this->user()?->isAdmin();
    }

    public function rules(): array
    {
        $rules = [
            'sumber' => ['nullable', 'string', 'max:255', new NoHtmlContent],
            'items' => ['required', 'array', 'size:'.Kabupaten::count()],
            'items.*.kabupaten_id' => ['required', 'integer', 'distinct', 'exists:kabupaten,kabupaten_id'],
        ];

        foreach (self::KOLOM_ANGKA as $kolom) {
            $rules["items.*.{$kolom}"] = ['required', 'integer', 'min:0', 'max:9999'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'sumber.max' => 'Sumber data maksimal 255 karakter.',
            'items.required' => 'Data wilayah wajib diisi.',
            'items.size' => 'Rekap harus berisi seluruh :size wilayah.',
            'items.*.kabupaten_id.*' => 'Data wilayah tidak dikenali.',
            'items.*.*.required' => 'Semua angka wajib diisi (isi 0 jika memang tidak ada).',
            'items.*.*.integer' => 'Angka harus berupa bilangan bulat.',
            'items.*.*.min' => 'Angka tidak boleh negatif.',
            'items.*.*.max' => 'Angka maksimal 9999.',
        ];
    }
}
