<?php

namespace App\Http\Controllers\Public;

use App\Exceptions\ChatbotException;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChatbotRequest;
use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;

class ChatbotController extends Controller
{
    public function __construct(protected ChatbotService $service) {}

    public function chat(ChatbotRequest $request): JsonResponse
    {
        try {
            $reply = $this->service->ask(
                trim($request->validated('message')),
                $request->validated('history') ?? [],
            );
        } catch (ChatbotException $e) {
            return response()->json(['message' => $e->getMessage()], $e->status);
        }

        return response()->json(['reply' => $reply]);
    }
}
