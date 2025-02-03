<?php

use App\Http\Controllers\TransactionController;
use App\Http\Controllers\GoogleDriveController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'transactions'], function () {
    Route::get('/', [TransactionController::class, 'index']);
    Route::post('/', [TransactionController::class, 'store']);
    Route::get('/show/{id}', [TransactionController::class, 'show']);
});

Route::group(['prefix' => 'drive'], function () {
    Route::post('/', [GoogleDriveController::class, 'ocr']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
