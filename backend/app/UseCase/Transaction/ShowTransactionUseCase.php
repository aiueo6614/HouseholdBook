<?php

namespace App\UseCase\Transaction;

use App\Repositories\TransactionRepositoryInterface;

class  ShowTransactionUseCase
{
    private $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function execute(array $id)
    {
        return $this->transactionRepository->find($id);
    }
}

