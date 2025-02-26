<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use App\UseCase\Transaction\GetTransactionsUseCase;
use App\UseCase\Transaction\CreateTransactionUseCase;
use App\UseCase\Transaction\ShowTransactionUseCase;
use App\UseCase\Transaction\UpdateTransactionUseCase;
use App\UseCase\Transaction\DeleteTransactionUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    private $getTransactionsUseCase;
    private $createTransactionUseCase;
    private $showTransactionUseCase;
    private $updateTransactionUseCase;
    private $deleteTransactionUseCase;

    public function __construct(
        GetTransactionsUseCase   $getTransactionsUseCase,
        CreateTransactionUseCase $createTransactionUseCase,
        ShowTransactionUseCase   $showTransactionUseCase,
        UpdateTransactionUseCase $updateTransactionUseCase,
        DeleteTransactionUseCase $deleteTransactionUseCase
    )
    {
        $this->getTransactionsUseCase = $getTransactionsUseCase;
        $this->createTransactionUseCase = $createTransactionUseCase;
        $this->showTransactionUseCase = $showTransactionUseCase;
        $this->updateTransactionUseCase = $updateTransactionUseCase;
        $this->deleteTransactionUseCase = $deleteTransactionUseCase;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $transactions = $this->getTransactionsUseCase->execute();
        return new JsonResponse($transactions, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $transaction = $this->createTransactionUseCase->execute($request->input('transactions'));
        return new JsonResponse($transaction, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $transaction = $this->showTransactionUseCase->execute($id);
        return new JsonResponse($transaction, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request): JsonResponse
    {
        $transactions = $this->updateTransactionUseCase->execute($request->input('transactions'));
        return new JsonResponse($transactions, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Request $request): JsonResponse
    {
        $transactions = $this->deleteTransactionUseCase->execute($request->input('transactions'));
        return new JsonResponse($transactions, 200);
    }
}
