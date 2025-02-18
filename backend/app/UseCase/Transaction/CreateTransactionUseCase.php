<?php

namespace App\UseCase\Transaction;

use App\Repositories\TransactionRepositoryInterface;
use App\Models\Transaction;

class CreateTransactionUseCase
{
    private $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function execute(array $date): Transaction
    {
        return $this->transactionRepository->create($date);
    }
}
