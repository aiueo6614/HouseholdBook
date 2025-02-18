<?php

namespace App\UseCase\Transaction;

use App\Repositories\TransactionRepositoryInterface;

class UpdateTransactionUseCase
{
    private $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function execute(array $data)
    {
        $results = [];
        foreach ($data as $transaction) {
            $results[] = $this->transactionRepository->update($transaction);
        }
        return $results;
    }
}
