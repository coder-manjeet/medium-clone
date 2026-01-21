<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
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

    Route::get('/home', [HomeController::class, 'index'])->name('home.feed');
    Route::get('/home/for-you', [HomeController::class, 'forYou'])->name('home.for-you');
    Route::get('/home/featured', [HomeController::class, 'featured'])->name('home.featured');

    Route::get('/library', function () {
        return Inertia::render('library');
    })->name('library');

    // Dynamic user profile routes - must come before the static /profile route
    Route::get('/@{user:name}', [ProfileController::class, 'show'])->name('user.profile');
    Route::get('/@{user:name}/posts', [ProfileController::class, 'getPosts'])->name('user.posts');

    // Static profile route for authenticated user's own profile settings
    Route::get('/profile', [ProfileController::class, 'showCurrentUser'])->name('profile');

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
