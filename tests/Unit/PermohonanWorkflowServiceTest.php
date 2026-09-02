<?php

namespace Tests\Unit;

use App\Services\PermohonanWorkflowService;
use PHPUnit\Framework\TestCase;

class PermohonanWorkflowServiceTest extends TestCase
{
    public function test_fasilitasi_can_be_completed_without_optional_document_six(): void
    {
        $uploadedDocs = [1, 2, 3, 4, 5, 7];

        $this->assertTrue(
            PermohonanWorkflowService::isFasilitasiComplete($uploadedDocs)
        );
    }

    public function test_fasilitasi_cannot_be_completed_without_required_document_seven(): void
    {
        $uploadedDocs = [1, 2, 3, 4, 5, 6];

        $this->assertFalse(
            PermohonanWorkflowService::isFasilitasiComplete($uploadedDocs)
        );
    }
}

