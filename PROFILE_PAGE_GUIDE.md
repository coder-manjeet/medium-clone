# Profile Page Implementation Guide

## Overview
The profile page has been fully implemented with both backend (Laravel) and frontend (React) components. The page displays user profiles with their published posts, followers count, and related information.

## Files Created/Modified

### Backend

#### 1. **ProfileController** - `app/Http/Controllers/ProfileController.php`
   - **New File**
   - Handles profile page requests
   - Two main methods:
     - `show(Request $request, User $user)` - Displays profile page with initial data
     - `getPosts(Request $request, User $user)` - API endpoint for infinite scroll pagination

#### 2. **Routes** - `routes/web.php`
   - Added two new protected routes:
     ```php
     Route::get('/@{user:name}', [ProfileController::class, 'show'])->name('user.profile');
     Route::get('/@{user:name}/posts', [ProfileController::class, 'getPosts'])->name('user.posts');
     ```

#### 3. **User Model** - `app/Models/User.php`
   - Added `getRouteKeyName()` method to resolve routes by username instead of ID
   - Added `cover_image_url` to fillable attributes
   - Uses existing relationships: `followers()`, `follows()`, `publications()`, `posts()`

#### 4. **Migration** - `database/migrations/2025_01_21_000001_add_cover_image_to_users_table.php`
   - New file
   - Adds `cover_image_url` column to users table for profile cover images

### Frontend

#### 1. **Profile Component** - `resources/js/pages/profile.tsx`
   - Completely redesigned from placeholder
   - Displays:
     - Profile header with cover image and avatar
     - User information (name, pronouns, followers count, bio)
     - Follow/Edit buttons (context-aware)
     - Three tabs: Home (posts), Lists, About
     - Right sidebar with Following section and Publications

#### 2. **Types** - `resources/js/types/index.d.ts`
   - Added `cover_image_url` to User interface
   - Changed Post `content` type from `any` to `Record<string, unknown>`
   - Type-safe implementation throughout

## Feature Breakdown

### Profile Header Section
- **Cover Image**: Displays user's cover image with gradient fallback
- **Avatar**: Large circular avatar with user initials fallback
- **User Info**: Name, pronouns (hardcoded as "he/him" - can be customized), follower count
- **Bio**: Optional bio display

### Action Buttons
- **Own Profile**: Shows "Edit profile" button linking to settings
- **Other Profiles**: Shows "Follow", "Share", and "More options" buttons

### Tabs

#### 1. Home Tab
- Displays user's published posts using infinite scroll
- Uses existing `InfiniteScrollFeed` component
- Loads posts from `@{user:name}/posts` endpoint

#### 2. Lists Tab
- Placeholder for future lists feature
- Shows "No lists yet" message

#### 3. About Tab
- User's bio
- Publications owned by the user
- Account creation date

### Right Sidebar
- **Following Section**: Shows up to 5 users this profile is following
- **Publications Section**: Shows publications owned by the user
- Clickable user cards linking to their profiles

## Data Flow

### Page Load (SSR)
1. User navigates to `/@{username}`
2. `ProfileController@show()` is called
3. User data is fetched including:
   - User profile information
   - Follower count
   - Following list
   - Publications
   - Initial paginated posts (page 1)
4. Data is passed to React component via Inertia
5. Page renders with all data

### Infinite Scroll
1. User scrolls to bottom of posts feed
2. InfiniteScrollFeed component detects intersection
3. Fetches next page via `@{user:name}/posts?page=2`
4. `ProfileController@getPosts()` returns JSON
5. Posts are appended to the feed

## Route Model Binding

The profile page uses route model binding with the username:
```
/@{user:name}
```

This works because the User model now has:
```php
public function getRouteKeyName(): string
{
    return 'name';
}
```

Example URLs:
- `/@john-doe` - User with name "john-doe"
- `/@jane-smith` - User with name "jane-smith"

## Database Schema

### Added Column
```sql
ALTER TABLE users ADD cover_image_url VARCHAR(255) NULLABLE;
```

### Existing Columns Used
- `id` - User ID
- `name` - Username and route key
- `email` - User email
- `avatar_url` - Avatar image URL
- `bio` - User biography
- `created_at` - Account creation date
- `updated_at` - Last update

## Styling

The profile page uses:
- **Tailwind CSS** for layout and styling
- **Shadcn/UI Components**: Tabs, Avatar, Button
- **Grid Layout**: 100 columns with 16-50-34 distribution
  - Left sidebar: 16 columns
  - Main content: 50 columns
  - Right sidebar: 34 columns
- **Dark Mode Support**: Fully implemented with dark: utilities

## Access Control

The profile page is protected by:
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Profile routes here
});
```

Users must be:
- Authenticated (`auth` middleware)
- Email verified (`verified` middleware)

## Future Enhancements

1. **Follow Action**: Implement actual follow/unfollow functionality
2. **Edit Profile**: Update profile cover, bio, and avatar
3. **User Statistics**: Show post count, total reads, etc.
4. **Lists**: Implement user-created reading lists
5. **Pronouns**: Add pronouns to user model instead of hardcoding
6. **Social Links**: Add social media links to About section
7. **Publications List**: Full publications management
8. **Pinned Posts**: Allow users to pin favorite posts

## Testing

### Manual Testing Steps

1. **Create Test Users**:
   ```bash
   php artisan tinker
   >>> $user = User::factory()->create(['name' => 'test-user', 'bio' => 'Test bio']);
   >>> exit
   ```

2. **Visit Profile**:
   - Navigate to `http://localhost:8000/@test-user`

3. **Create Test Posts**:
   ```bash
   php artisan tinker
   >>> $user = User::first();
   >>> $user->posts()->create(['title' => 'Test Post', 'published_at' => now()]);
   >>> exit
   ```

4. **Test Infinite Scroll**:
   - Scroll down on the profile page
   - Posts should load dynamically

### Running Tests
```bash
php artisan test
npm run lint
```

## Troubleshooting

### Profile Page Not Loading
- Check if user exists: `Route::get('/@{user:name}', ...)` requires valid username
- Verify authentication middleware is working
- Check browser console for JavaScript errors

### Posts Not Showing
- Ensure posts have `published_at` set to a past date
- Verify `user_id` matches the profile user
- Check database for posts with correct user_id

### Styling Issues
- Clear browser cache: Ctrl+Shift+Delete
- Rebuild frontend: `npm run build`
- Check Tailwind config for dark mode settings

## API Endpoints

### GET `/@{user:name}`
Returns profile page with:
- User data
- Follower count
- Following list
- Publications
- Initial posts (page 1)

### GET `/@{user:name}/posts?page={page}`
Returns paginated posts in JSON format:
```json
{
  "data": [...],
  "current_page": 1,
  "last_page": 5,
  "per_page": 10,
  "total": 50,
  "has_more": true
}
```

## Performance Considerations

1. **Pagination**: Posts are paginated with 10 per page
2. **Query Optimization**: Uses `with(['author', 'tags'])` for eager loading
3. **Published Posts Filter**: Only shows posts with `published_at <= now()`
4. **Caching**: Can be implemented for follower counts

## Security Notes

- Routes require authentication and email verification
- Route model binding prevents direct access to unpublished posts
- CSRF protection included via Inertia middleware
- User data is sanitized before rendering

## Notes

- The profile page structure mirrors the home.tsx layout for consistency
- Follow functionality is stubbed and ready for implementation
- All Wayfinder types have been regenerated
- ESLint passes with no profile-related errors
