---
name: laravel-ai-integration
description: Patterns for integrating AI models and LLM services in Laravel. Covers structured JSON outputs, document text extraction (PDF/DOCX), prompt engineering, asynchronous queue processing for heavy AI jobs, and streaming responses to Inertia React frontend.
---

# Laravel AI Integration Guide

Guidance for implementing AI features (such as automated legal/document analysis in `AIAssistantPage`) within Laravel backend and Inertia frontend.

## 1. Document Extraction & Processing Pipeline

1. **Upload & Storage**:
   - Store temporary uploaded files securely in `storage/app/temp` or `storage/app/documents`.
2. **Text Extraction**:
   - Use standard PHP text extractors (e.g. `smalot/pdfparser` for PDF, `phpoffice/phpword` for DOCX) or cloud vision APIs.
3. **Chunking & Token Limits**:
   - For long legal documents, break text into chapters/articles (*Pasal & Ayat*) or semantic chunks before passing to LLM context.

## 2. Structured JSON Output

Always instruct LLMs to respond with strict JSON schemas that map directly to the frontend React state.

```json
{
  "score": 85,
  "totalErrors": 4,
  "writingErrors": 2,
  "structureErrors": 1,
  "formatErrors": 1,
  "recommendations": 1,
  "errors": [
    {
      "type": "Struktur Peraturan",
      "severity": "Tinggi",
      "page": "Halaman 3",
      "description": "Format nomor pasal tidak sesuai dengan pedoman pembentukan undang-undang."
    }
  ]
}
```

## 3. Background Job Architecture

AI document analysis can take several seconds to complete. Process heavy AI analysis via Laravel Queue Jobs:

```php
namespace App\Jobs;

use App\Models\DocumentAnalysis;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AnalyzeDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public DocumentAnalysis $analysis) {}

    public function handle(AiService $aiService): void
    {
        $this->analysis->update(['status' => 'processing']);

        $result = $aiService->analyzeDocument($this->analysis->file_path);

        $this->analysis->update([
            'status' => 'completed',
            'result' => $result,
        ]);
    }
}
```

## 4. Polling or Realtime Updates with Inertia

- Use Inertia's `router.reload({ only: ['analysis'] })` with a short polling interval in React while `status === 'processing'`, or push updates using Laravel Reverb / Echo broadcasting.
