<?php

namespace App\Http\Requests\Permohonan;

use App\Rules\NoHtmlContent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePermohonanRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && ($user->isTimKerja() || $user->isAdmin());
    }

    public function rules(): array
    {
        $user = $this->user();

        return [
            'judul_rancangan' => ['required', 'string', 'min:5', 'max:500', new NoHtmlContent()],
            'nomor_regulasi' => ['nullable', 'string', 'max:100', new NoHtmlContent()],
            'jenis_regulasi_id' => ['required', 'integer', Rule::in([1, 2])],
            'kabupaten_id' => [
                'required',
                'integer',
                'exists:kabupaten,kabupaten_id',
                function ($attribute, $value, $fail) use ($user) {
                    if ($user->isTimKerja() && $user->tim_kerja_id) {
                        $kabupaten = \App\Models\Kabupaten::find($value);
                        if ($kabupaten && (int) $kabupaten->tim_kerja_id !== (int) $user->tim_kerja_id) {
                            $fail("Kabupaten/Kota yang dipilih bukan bagian dari wilayah binaan Tim Kerja Anda ({$user->timKerja?->nama_tim_kerja}).");
                        }
                    }
                }
            ],
            'keterangan' => ['nullable', 'string', 'max:1000', new NoHtmlContent()],
            'initial_file' => [
                'nullable',
                'file',
                'max:25600', // max 25MB
                function ($attribute, $value, $fail) {
                    if ($value && $value->isValid()) {
                        $ext = strtolower($value->getClientOriginalExtension());
                        if (! in_array($ext, ['pdf', 'doc', 'docx'])) {
                            $fail('Format berkas draf harus berupa PDF, DOC, atau DOCX.');
                        }
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'judul_rancangan.required' => 'Judul rancangan peraturan wajib diisi.',
            'judul_rancangan.min' => 'Judul rancangan peraturan minimal 5 karakter.',
            'jenis_regulasi_id.required' => 'Jenis peraturan wajib dipilih (Ranperda atau Ranperkada).',
            'jenis_regulasi_id.in' => 'Jenis peraturan hanya dapat berupa Ranperda atau Ranperkada.',
            'kabupaten_id.required' => 'Kabupaten / Kota pemrakarsa wajib dipilih.',
            'kabupaten_id.exists' => 'Kabupaten / Kota yang dipilih tidak valid.',
            'initial_file.max' => 'Ukuran berkas draf maksimal adalah 25MB.',
        ];
    }
}
