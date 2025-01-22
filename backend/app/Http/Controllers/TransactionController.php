<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\UseCase\Transaction\GetTransactionsUseCase;
use App\UseCase\Transaction\CreateTransactionUsecase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    private $getTransactionsUseCase;
    private $createTransactionUseCase;

    public function __construct(
        GetTransactionsUseCase $getTransactionsUseCase,
        CreateTransactionUsecase $createTransactionUseCase
    )
    {
        $this->getTransactionsUseCase = $getTransactionsUseCase;
        $this->createTransactionUseCase = $createTransactionUseCase;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $transactions = $this->getTransactionsUseCase->execute();
        return new JsonResponse($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TransactionRequest $request): JsonResponse
    {
        $transaction = $this->createTransactionUseCase->execute($request->validated());
        return new JsonResponse($transaction, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
