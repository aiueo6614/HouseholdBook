<?php

namespace App\Providers;

use App\Repositories\TransactionRepository;
use App\Repositories\TransactionRepositoryInterface;
use App\UseCase\Transaction\GetTransactionsUseCase;
use App\UseCase\Transaction\CreateTransactionUsecase;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            TransactionRepositoryInterface::class,
            TransactionRepository::class
        );

        $this->app->bind(GetTransactionsUseCase::class,
            function($app) {
                return new GetTransactionsUseCase($app->make(TransactionRepositoryInterface::class));
            }
        );

        $this->app->bind(CreateTransactionUsecase::class,
            function($app) {
                return new CreateTransactionUsecase($app->make(TransactionRepositoryInterface::class));
            }
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
