<?php

namespace App\Http\Requests\Permohonan;

use App\Rules\NoHtmlContent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            // Endpoint ini hanya untuk keputusan fasilitasi: 4 = Selesai, 5 = Perlu Perbaikan
            'status_id' => ['required', 'integer', Rule::in([4, 5])],
            'catatan' => ['nullable', 'required_if:status_id,5', 'string', 'max:2000', new NoHtmlContent()],
            'surat_file' => [
                'nullable',
                'file',
                'max:25600', // Maksimal 25MB
                function ($attribute, $value, $fail) {
                    if ($value && ! $value->isValid()) {
                        $fail('File surat keputusan yang diunggah rusak atau tidak valid.');
                        return;
                    }
                    if ($value) {
                        $ext = strtolower($value->getClientOriginalExtension());
                        // Surat Fasilitasi Rancangan Peraturan wajib PDF (dokumen resmi bertandatangan)
                        if ($ext !== 'pdf') {
                            $fail('Surat fasilitasi rancangan peraturan wajib diunggah dalam format PDF.');
                        }
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status_id.required' => 'Status baru wajib dipilih.',
            'status_id.in' => 'Keputusan fasilitasi hanya dapat berupa Selesai atau Perlu Perbaikan.',
            'catatan.required_if' => 'Alasan pengembalian berkas wajib diisi.',
            'surat_file.max' => 'Ukuran file surat tidak boleh melebihi 25MB.',
        ];
    }
}
