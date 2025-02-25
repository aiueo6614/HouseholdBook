<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GeminiController
{
    private $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function ocr(Request $request): JsonResponse
    {
        $image = $request->getContent();
        $result = $this->geminiService->gemini($image);

        return new JsonResponse($result, 200);
    }
}
