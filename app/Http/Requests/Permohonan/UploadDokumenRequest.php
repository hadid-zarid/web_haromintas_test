<?php

namespace App\Http\Requests\Permohonan;

use App\Rules\NoHtmlContent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadDokumenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'jenis_dokumen_id' => ['required', 'integer', Rule::in([1, 2, 3, 4, 5, 6, 7])],
            'file' => [
                'required',
                'file',
                'max:25600', // 25MB
                function ($attribute, $value, $fail) {
                    if ($value && $value->isValid()) {
                        $ext = strtolower($value->getClientOriginalExtension());
                        $jenisDokumenId = (int) $this->input('jenis_dokumen_id');

                        // Dokumen 5 (Surat Resmi Hasil Harmonisasi) dan Dokumen 7 (Surat Keputusan Fasilitasi)
                        // wajib berformat PDF karena merupakan surat resmi yang ditandatangani.
                        if (in_array($jenisDokumenId, [5, 7])) {
                            if ($ext !== 'pdf') {
                                $fail('Surat resmi hasil harmonisasi/fasilitasi wajib diunggah dalam format PDF.');
                            }
                        } elseif (! in_array($ext, ['pdf', 'doc', 'docx'])) {
                            $fail('Format berkas dokumen harus berupa PDF, DOC, atau DOCX.');
                        }
                    }
                },
            ],
            'keterangan' => ['nullable', 'string', 'max:500', new NoHtmlContent()],
        ];
    }

    public function messages(): array
    {
        return [
            'jenis_dokumen_id.required' => 'Jenis dokumen wajib ditentukan.',
            'jenis_dokumen_id.in' => 'Jenis dokumen tidak valid.',
            'file.required' => 'Berkas dokumen wajib diunggah.',
            'file.max' => 'Ukuran berkas dokumen maksimal 25MB.',
        ];
    }
}
