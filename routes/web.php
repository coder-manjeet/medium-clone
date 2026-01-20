<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/home', function () {
        return Inertia::render('home');
    })->name('home.feed');

    Route::get('/library', function () {
        return Inertia::render('library');
    })->name('library');

    Route::get('/profile', function () {
        return Inertia::render('profile');
    })->name('profile');

    Route::get('/stories', function () {
        return Inertia::render('stories');
    })->name('stories');

    Route::get('/stats', function () {
        return Inertia::render('stats');
    })->name('stats');

    Route::get('/following', function () {
        return Inertia::render('following');
    })->name('following');
});

require __DIR__.'/settings.php';
