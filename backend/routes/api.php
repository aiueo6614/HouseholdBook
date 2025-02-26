<?php

use App\Http\Controllers\TransactionController;
use App\Http\Controllers\GoogleDriveController;
use App\Http\Controllers\GeminiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'transactions'], function () {
    Route::get('/', [TransactionController::class, 'index']);
    Route::post('/', [TransactionController::class, 'store']);
    Route::get('{id}/', [TransactionController::class, 'show']);
    Route::put('/', [TransactionController::class, 'update']);
    Route::delete('/', [TransactionController::class, 'delete']);
});

Route::group(['prefix' => 'ocr'], function () {
    Route::post('/drive', [GoogleDriveController::class, 'ocr']);
    Route::post('/gemini', [GeminiController::class, 'ocr']);

});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
