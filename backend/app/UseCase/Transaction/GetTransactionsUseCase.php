<?php

namespace App\UseCase\Transaction;

use App\Repositories\TransactionRepositoryInterface;

class GetTransactionsUseCase
{
    private $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function execute()
    {
        return $this->transactionRepository->getAll();
    }
}
