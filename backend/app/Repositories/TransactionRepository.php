<?php

namespace App\Repositories;

use App\Models\Transaction;

class TransactionRepository implements TransactionRepositoryInterface
{
    public function getAll()
    {
        return Transaction::all();
    }

    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    public function find(int $id): Transaction
    {
        return Transaction::find($id);
    }

    public function update(array $data): Transaction
    {
        return tap(Transaction::find($data['id']))->update($data);
    }
}
