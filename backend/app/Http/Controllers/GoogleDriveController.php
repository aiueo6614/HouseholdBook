<?php

namespace App\Http\Controllers;

use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class GoogleDriveController extends Controller
{
    private $googleDriveService;

    public function __construct(GoogleDriveService $googleDriveService)
    {
        $this->googleDriveService = $googleDriveService;
    }

    public function ocr(Request $request): JsonResponse
    {
        $uploadedDriveFile = $this->googleDriveService->uploadImageAsDocument($request->getContent());
        $ocrOutputText = $this->googleDriveService->extractTextFromDocument($uploadedDriveFile->id);
        $productAndPrice = $this->googleDriveService->extractProductAndPrice($ocrOutputText);

        return new JsonResponse($productAndPrice, 200);
    }
}
