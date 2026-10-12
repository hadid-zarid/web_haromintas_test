<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ChatbotTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
        config([
            'services.chatbot.api_key' => 'kunci-uji',
            'services.chatbot.base_url' => 'https://llm.test/v1',
            'services.chatbot.model' => 'model-uji',
            'services.chatbot.daily_limit' => 1000,
        ]);
    }

    private function fakeLlm(string $content = 'Klik **Masuk Petugas**.', int $status = 200): void
    {
        Http::fake([
            'llm.test/*' => Http::response(
                $status === 200 ? ['choices' => [['message' => ['content' => $content]]]] : ['error' => 'x'],
                $status,
            ),
        ]);
    }

    public function test_pengunjung_tanpa_login_bisa_bertanya_dan_mendapat_jawaban(): void
    {
        $this->fakeLlm();

        $this->postJson('/api/chatbot', ['message' => 'Bagaimana cara masuk?'])
            ->assertOk()
            ->assertJson(['reply' => 'Klik **Masuk Petugas**.']);
    }

    public function test_permintaan_ke_llm_memuat_pengetahuan_dan_kunci_tetapi_tidak_membocorkannya_ke_klien(): void
    {
        $this->fakeLlm();

        $response = $this->postJson('/api/chatbot', ['message' => 'Apa itu HARMONITAS?'])->assertOk();

        Http::assertSent(function ($request) {
            $body = $request->data();

            return $request->url() === 'https://llm.test/v1/chat/completions'
                && $request->hasHeader('Authorization', 'Bearer kunci-uji')
                && $body['model'] === 'model-uji'
                && str_contains($body['messages'][0]['content'], 'humaskumriau@gmail.com') // kontak dari berkas pengetahuan
                && end($body['messages']) === ['role' => 'user', 'content' => 'Apa itu HARMONITAS?'];
        });
        $this->assertStringNotContainsString('kunci-uji', $response->getContent());
    }

    public function test_riwayat_dikirim_dan_dipotong_pada_batas(): void
    {
        $this->fakeLlm();
        $history = [];
        for ($i = 0; $i < 6; $i++) {
            $history[] = ['role' => $i % 2 ? 'assistant' : 'user', 'content' => "pesan $i"];
        }

        $this->postJson('/api/chatbot', ['message' => 'lanjut', 'history' => $history])->assertOk();

        Http::assertSent(fn ($r) => count($r->data()['messages']) === 1 + 6 + 1);
    }

    public function test_pesan_kosong_terlalu_panjang_atau_riwayat_tidak_valid_ditolak_tanpa_memanggil_llm(): void
    {
        $this->fakeLlm();

        $this->postJson('/api/chatbot', ['message' => ''])->assertStatus(422);
        $this->postJson('/api/chatbot', ['message' => str_repeat('a', 501)])->assertStatus(422);
        $this->postJson('/api/chatbot', ['message' => 'ok', 'history' => [['role' => 'system', 'content' => 'x']]])->assertStatus(422);
        $this->postJson('/api/chatbot', ['message' => 'ok', 'history' => array_fill(0, 7, ['role' => 'user', 'content' => 'x'])])->assertStatus(422);

        Http::assertNothingSent();
    }

    public function test_fitur_mati_bila_kunci_kosong(): void
    {
        config(['services.chatbot.api_key' => null]);
        Http::fake();

        $this->postJson('/api/chatbot', ['message' => 'halo'])->assertStatus(503);
        Http::assertNothingSent();

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('chatbotAktif', false));
    }

    public function test_landing_menandai_chatbot_aktif_bila_kunci_ada(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('chatbotAktif', true));
    }

    public function test_kegagalan_penyedia_llm_menjadi_pesan_ramah_tanpa_detail_teknis(): void
    {
        $this->fakeLlm(status: 401);

        $response = $this->postJson('/api/chatbot', ['message' => 'halo'])->assertStatus(503);

        $this->assertStringNotContainsString('401', $response->getContent());
        $this->assertStringNotContainsString('kunci-uji', $response->getContent());
    }

    public function test_jawaban_kosong_dari_llm_ditangani(): void
    {
        $this->fakeLlm('   ');

        $this->postJson('/api/chatbot', ['message' => 'halo'])->assertStatus(503);
    }

    public function test_batas_harian_global_menolak_dan_tidak_memanggil_llm_lagi(): void
    {
        config(['services.chatbot.daily_limit' => 2]);
        $this->fakeLlm();

        $this->postJson('/api/chatbot', ['message' => 'satu'])->assertOk();
        $this->postJson('/api/chatbot', ['message' => 'dua'])->assertOk();
        $this->postJson('/api/chatbot', ['message' => 'tiga'])->assertStatus(429);

        Http::assertSentCount(2);
    }

    public function test_batas_per_ip_menghentikan_pengiriman_beruntun(): void
    {
        $this->fakeLlm();

        for ($i = 0; $i < 12; $i++) {
            $this->postJson('/api/chatbot', ['message' => "tanya $i"])->assertOk();
        }
        $this->postJson('/api/chatbot', ['message' => 'terlalu banyak'])->assertStatus(429);
    }
}
