<?php

namespace App\Http\Requests\Profil;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateAvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            // Browser mengirim JPEG 512px hasil potong; batas dimensi mencegah "decompression bomb".
            'avatar' => [
                'required',
                File::image()
                    ->types(['jpg', 'jpeg', 'png'])
                    ->max(2 * 1024)
                    ->dimensions(Rule::dimensions()->minWidth(64)->minHeight(64)->maxWidth(4000)->maxHeight(4000)),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.required' => 'Pilih foto terlebih dahulu.',
            'avatar.image' => 'File harus berupa gambar.',
            'avatar.mimes' => 'Foto harus berformat JPG atau PNG.',
            'avatar.max' => 'Ukuran foto maksimal 2 MB.',
            'avatar.dimensions' => 'Ukuran foto harus antara 64 dan 4000 piksel.',
        ];
    }
}
