# AI Coding Agent Instructions for Medium Clone

## Project Overview
Full Medium clone: Auth, writing/publishing, feeds, claps/comments, follows, publications. Use Inertia for server-driven React SPA; Wayfinder for typed TS route functions. No APIs—web routes pass props. 
Medium Clone is a full-stack blogging platform built with **Laravel 12** (backend), **React + Inertia.js** (frontend), and **Wayfinder** for typed API functions. It features user authentication (Laravel Fortify), profile management, and a modern UI with Shadcn components and TailwindCSS.

## Architecture

### Backend Stack
- **Laravel 12** with PSR-4 autoloading under `App\\`
- **Inertia.js** for server-driven rendering with React components
- **Laravel Fortify** for auth scaffolding (two-factor auth included)
- **Wayfinder** auto-generates TypeScript functions from routes (`php artisan wayfinder:generate`)

### Frontend Stack
- **React 19** with TypeScript (`resources/js/`)
- **Inertia.js** bridges Laravel & React with props-based page rendering
- **Shadcn/UI** (Radix + TailwindCSS) for component library
- **Vite** with TailwindCSS v4 and React Compiler for bundling

### Key Data Flow
1. **Route Definition** (`routes/web.php`, `routes/settings.php`):
   - Use `Inertia::render('page-name', $props)` to render React pages
   - Settings routes are namespaced under `Settings` controllers
2. **Controller to Frontend** (`app/Http/Controllers/Settings/`):
   - Controllers use `Inertia::render()` to pass data as props
   - Example: `ProfileController`, `PasswordController`, `TwoFactorAuthenticationController`
3. **Frontend to Backend** via Wayfinder:
   - Typed TypeScript functions auto-generated from routes
   - Call from React: `createPost()`, `fetchPosts()` (examples from README)
   - Regenerate after adding routes: `php artisan wayfinder:generate`

## Critical Developer Workflows

### Database & Migrations
```bash
php artisan migrate                    # Run migrations
php artisan db:seed                    # Seed data (optional)
php artisan migrate:fresh --seed       # Reset and seed (development only)
```
- Migrations stored in `database/migrations/`
- User model: `app/Models/User.php` with Two-Factor auth traits
- Factories in `database/factories/` (e.g., `UserFactory`)

### Frontend Development
```bash
npm run dev                            # Start Vite dev server + HMR
npm run build                          # Production build
npm run format                         # Prettier formatting
npm run lint                           # ESLint + TypeScript check
npm run types                          # Type-check without emit
```
- Frontend runs on **separate dev server** (auto-configured by Vite)
- Backend served by `php artisan serve` (port 8000)

### Wayfinder Type Generation
```bash
php artisan wayfinder:generate         # Generate TypeScript from routes
```
- **Auto-run after route changes** before testing frontend
- Generated functions in `resources/js/wayfinder/` with full type hints
- Enables type-safe backend calls from React

### Testing
```bash
php artisan test                       # Run PHPUnit tests
# Config in phpunit.xml uses SQLite in-memory DB for speed
```
- Feature tests in `tests/Feature/`
- Unit tests in `tests/Unit/`
- Extends `Tests\TestCase` (in `tests/TestCase.php`)

### Code Quality
```bash
npm run lint --fix                     # Auto-fix ESLint issues
npm run format                         # Auto-format with Prettier
php artisan pint                       # PHP code formatting (Laravel preset)
```

## Project Structure & Conventions

### React Pages & Components
- **Pages**: `resources/js/pages/*.tsx` (automatically routed by Inertia)
  - Example: `pages/dashboard.tsx` → route `/dashboard`
  - Example: `pages/settings/profile.tsx` → route `/settings/profile`
- **Components**: `resources/js/components/*.tsx` (reusable UI)
  - Layout wrappers: `app-shell.tsx`, `app-header.tsx`, `app-sidebar.tsx`
  - Form components: `delete-user.tsx`, `two-factor-setup-modal.tsx`
- **Hooks**: `resources/js/hooks/` (custom React hooks, e.g., `use-appearance.ts`)
- **Lib**: `resources/js/lib/` (utilities, helpers, validators)
- **UI**: `resources/js/components/ui/` (Shadcn/Radix primitives)

### Laravel Controllers & Routes
- **Settings controllers**: `app/Http/Controllers/Settings/` (ProfileController, PasswordController, TwoFactorAuthenticationController)
- **Route groups**: Protect with middleware like `['auth', 'verified']`
- **Requests**: `app/Http/Requests/` (form request validation)
- **Concerns**: `app/Concerns/` (shared traits, e.g., `PasswordValidationRules`, `ProfileValidationRules`)

### Configuration Files
- `.env` required; copy from `.env.example` and run `php artisan key:generate`
- **Database**: Configured in `config/database.php` (SQLite default, MySQL/PostgreSQL supported)
- **Auth**: `config/auth.php` and `config/fortify.php` (two-factor auth enabled)
- **Inertia**: `config/inertia.php` (SSR configuration)

## Important Patterns & Conventions

### Middleware Usage
- `auth` - Requires logged-in user
- `verified` - Requires email verification
- Applied in route groups: `Route::middleware(['auth', 'verified'])->group(...)`

### Two-Factor Authentication
- Managed by `TwoFactorAuthenticationController` in settings
- User model includes `TwoFactorAuthenticatable` trait
- Database columns added via migration `2025_08_26_100418_add_two_factor_columns_to_users_table.php`

### Validation Concerns
- Reusable validation rules in `app/Concerns/PasswordValidationRules.php` and `ProfileValidationRules.php`
- Controllers mix these concerns to reuse validation logic

### TypeScript & React Patterns
- All React components are `.tsx` files (TypeScript)
- Use type-safe props with interfaces (no PropTypes)
- ESLint configured to enforce React hooks rules
- Prettier configured with TailwindCSS class sorting

### Password Security
- Password hashing via `Hash::make()` in `User::casts()` as `'hashed'`
- Password validation enforced by `Illuminate\Validation\Rules\Password` in `AppServiceProvider::boot()`
- Production: Requires 12+ chars, mixed case, numbers; Development: No minimum

## Build & Deployment

### Development
```bash
composer install
npm install
php artisan key:generate
php artisan migrate
php artisan serve        # Runs on http://localhost:8000
npm run dev              # Separate Vite dev server
```

### Production
```bash
composer install --optimize-autoloader --no-dev
npm ci && npm run build
php artisan migrate --force
php artisan config:cache && php artisan route:cache
```

## Code Standards
- **PHP**: Laravel Pint preset (`pint.json: "preset": "laravel"`)
- **JS/TS**: ESLint + TypeScript strict mode + Prettier
- **Components**: Shadcn/UI + TailwindCSS v4 (use class variants)
- **CI/CD**: GitHub Actions workflows in `.github/workflows/` (lint.yml, tests.yml)

## When Adding Features
1. **Create routes** in `routes/web.php` or `routes/settings.php`
2. **Generate Wayfinder**: `php artisan wayfinder:generate`
3. **Create React page** in `resources/js/pages/`
4. **Add controller** in `app/Http/Controllers/` if needed
5. **Run tests**: `php artisan test` and `npm run lint`
6. **Verify**: `npm run dev` + `php artisan serve` before committing

## Schema
- users: id, name, email, password, bio, avatar_url.
- posts: id, user_id, title, subtitle, content (JSON), slug, published_at, claps_count.
- comments: id, post_id, user_id, body, parent_id.
- tags: id, name, slug.
- post_tag: post_id, tag_id.
- follows: id, user_id, followable_id, followable_type.
- claps: id, post_id, user_id, count.
- publications: id, name, description, owner_id.
- post_publication: publication_id, post_id.  

### Routes (web.php)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::post('/posts/{post}/claps', [ClapController::class, 'store'])->name('posts.claps');

### Controllers
- PostController::create(): return Inertia::render('Posts/Create');
- PostController::store(Request $request): validate, save, redirect via Inertia.
- Use middleware for auth.

## Frontend
### Structure
- resources/js/Pages/: Home.tsx, Posts/Show.tsx, Posts/Create.tsx
- resources/js/Components/: Editor.tsx, CommentThread.tsx
- resources/js/types/: Wayfinder output (routes.ts, models.ts)

### Key Components
- Create.tsx: import { Routes } from '@/types/routes';
  const form = useForm({title: '', content: ''});
  form.post(Routes.posts.store());
- Show.tsx: props: {post: PostType}; render Quill viewer, clap: Inertia.post(Routes.posts.claps({post: post.id, count}));