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
                        if (! in_array($ext, ['pdf', 'doc', 'docx'])) {
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
            'jenis_dokumen_id.required' => 'Slot jenis dokumen wajib ditentukan.',
            'jenis_dokumen_id.in' => 'Slot jenis dokumen tidak valid.',
            'file.required' => 'Berkas dokumen wajib diunggah.',
            'file.max' => 'Ukuran berkas dokumen maksimal 25MB.',
        ];
    }
}
