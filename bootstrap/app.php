<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            //
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                $status = $response->getStatusCode();

                if ($status === 419 && $request->header('X-Inertia')) {
                    return back()->with([
                        'error' => 'Sesi keamanan halaman telah kedaluwarsa. Silakan muat ulang halaman.',
                    ]);
                }

                if (in_array($status, [400, 401, 403, 404, 405, 419, 422, 429, 500, 502, 503, 504])) {
                    return \Inertia\Inertia::render('ErrorPage', [
                        'status' => $status,
                        'message' => ($status === 500 && ! config('app.debug'))
                            ? 'Terjadi kendala teknis pada server.'
                            : ($e->getMessage() ?: null),
                        'debug' => config('app.debug') ? [
                            'exception' => get_class($e),
                            'file' => $e->getFile(),
                            'line' => $e->getLine(),
                            'trace' => collect($e->getTrace())->take(5)->map(fn ($t) => [
                                'file' => $t['file'] ?? 'internal',
                                'line' => $t['line'] ?? 0,
                                'function' => $t['function'] ?? '',
                            ])->toArray(),
                        ] : null,
                    ])->toResponse($request)->setStatusCode($status);
                }
            }

            return $response;
        });
    })->create();
