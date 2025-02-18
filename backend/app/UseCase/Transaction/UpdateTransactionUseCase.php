<?php

/*
namespace App\UseCase\Transaction;

use App\Repositories\TransactionRepositoryInterface;

class UpdateTransactionsUseCase
{
    private $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function execute(Request $request, array $id)
    {
        return $this->transactionRepository->update($request,$id);
    }
}
    /

