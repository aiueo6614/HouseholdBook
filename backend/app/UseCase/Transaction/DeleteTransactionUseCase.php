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

    public function execute(int $id)
    {
        $this->transactionRepository->delete($id);
    }
}
