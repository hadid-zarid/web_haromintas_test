<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Config;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    public function test_forgot_password_page_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_forgot_password_page_receives_recaptcha_site_key_when_enabled(): void
    {
        Config::set('services.recaptcha.enabled', true);
        Config::set('services.recaptcha.site_key', 'test-site-key-123');

        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('ForgotPasswordPage')
            ->where('recaptchaSiteKey', 'test-site-key-123')
        );
    }

    public function test_forgot_password_page_has_null_recaptcha_site_key_when_disabled(): void
    {
        Config::set('services.recaptcha.enabled', false);

        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('ForgotPasswordPage')
            ->where('recaptchaSiteKey', null)
        );
    }

    public function test_send_reset_link_requires_recaptcha_when_enabled(): void
    {
        Config::set('services.recaptcha.enabled', true);

        $response = $this->post('/forgot-password', [
            'email' => 'user@harmonitas.go.id',
            // no recaptcha_token provided
        ]);

        $response->assertSessionHasErrors([
            'recaptcha_token' => 'Silakan centang kotak "Saya bukan robot" terlebih dahulu.',
        ]);
    }

    public function test_send_reset_link_validates_email_required(): void
    {
        Config::set('services.recaptcha.enabled', false);

        $response = $this->post('/forgot-password', [
            'email' => '',
        ]);

        $response->assertSessionHasErrors([
            'email' => 'Alamat email kedinasan wajib diisi.',
        ]);
    }
}
