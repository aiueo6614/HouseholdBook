<?php

namespace App\UseCase\Transaction;

use App\Repositories\TransactionRepositoryInterface;

class DeleteTransactionUseCase
{
    private $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function execute(array $transactions)
    {
        $results = [];
        foreach ($transactions as $transaction) {
            $results[] = $this->transactionRepository->delete($transaction);
        }
        return $results;
    }
}
