<?php

namespace App\Providers;

use App\Repositories\TransactionRepository;
use App\Repositories\TransactionRepositoryInterface;
use App\UseCase\Transaction\GetTransactionsUseCase;
use App\UseCase\Transaction\CreateTransactionUseCase;
use App\UseCase\Transaction\ShowTransactionUseCase;
use App\UseCase\Transaction\UpdateTransactionUseCase;
use App\UseCase\Transaction\DeleteTransactionUseCase;
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

        $this->app->bind(CreateTransactionUseCase::class,
            function($app) {
                return new CreateTransactionUseCase($app->make(TransactionRepositoryInterface::class));
            }
        );

        $this->app->bind(ShowTransactionUseCase::class,
            function($app) {
                return new ShowTransactionUseCase($app->make(TransactionRepositoryInterface::class));
            }
        );

        $this->app->bind(UpdateTransactionUseCase::class,
            function($app) {
                return new UpdateTransactionUseCase($app->make(TransactionRepositoryInterface::class));
            }
        );

        $this->app->bind(DeleteTransactionUseCase::class,
            function($app) {
                return new DeleteTransactionUseCase($app->make(TransactionRepositoryInterface::class));
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
