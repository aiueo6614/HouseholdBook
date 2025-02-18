<?php

namespace App\Repositories;

use App\Models\Transaction;

interface TransactionRepositoryInterface
{
    public function getAll();
    public function create(array $data): Transaction;
    public function find(int $id): Transaction;
}
