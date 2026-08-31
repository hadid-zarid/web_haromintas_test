<?php

namespace App\Http\Requests\Permohonan;

use App\Rules\NoHtmlContent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePermohonanRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && ($user->isTimKerja() || $user->isAdmin() || $user->isBiroHukum());
    }

    public function rules(): array
    {
        return [
            'judul_rancangan' => ['required', 'string', 'min:5', 'max:500', new NoHtmlContent()],
            'nomor_regulasi' => ['nullable', 'string', 'max:100', new NoHtmlContent()],
            'jenis_regulasi_id' => ['required', 'integer', Rule::in([1, 2])],
            'kabupaten_id' => ['required', 'integer', 'exists:kabupaten,kabupaten_id'],
            'status_id' => ['nullable', 'integer', 'exists:status_regulasi,status_id'],
            'keterangan' => ['nullable', 'string', 'max:1000', new NoHtmlContent()],
        ];
    }

    public function messages(): array
    {
        return [
            'judul_rancangan.required' => 'Judul rancangan peraturan wajib diisi.',
            'jenis_regulasi_id.required' => 'Jenis peraturan wajib dipilih (Ranperda atau Ranperkada).',
            'jenis_regulasi_id.in' => 'Jenis peraturan hanya dapat berupa Ranperda atau Ranperkada.',
            'kabupaten_id.required' => 'Kabupaten / Kota pemrakarsa wajib dipilih.',
        ];
    }
}
