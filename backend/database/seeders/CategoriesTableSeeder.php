<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expenses = [
            '固定費',
            '変動費',
            '食費',
            'その他(支出)',
        ];
        $incomes = [
            '収入',
            'その他(収益)',
        ];

        foreach ($expenses as $expense) {
            DB::table('categories')->insert([
                'title' => $expense,
                'type' => 'expense',
            ]);
        }
        foreach ($incomes as $income) {
            DB::table('categories')->insert([
                'title' => $income,
                'type' => 'income',
            ]);
        }
    }
}
