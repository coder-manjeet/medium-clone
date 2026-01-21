# Profile Page - Quick Reference

## 🎯 Key Endpoints

| Method | Route | Handler | Purpose |
|--------|-------|---------|---------|
| GET | `/@{user:name}` | `ProfileController@show` | Display profile page |
| GET | `/@{user:name}/posts?page={page}` | `ProfileController@getPosts` | Get paginated posts |

## 📋 Page Sections

### Header Section
- Cover image (gradient fallback or user image)
- User avatar with initials fallback
- Name, pronouns, follower count
- Bio (optional)
- Action buttons (Follow/Edit)

### Tab Navigation
1. **Home** - Published posts with infinite scroll
2. **Lists** - Placeholder for future feature
3. **About** - Bio, publications, joined date

### Right Sidebar
- **Following** - Up to 5 followed users
- **Publications** - User's owned publications

## 🗂️ File Locations

| File | Purpose |
|------|---------|
| `app/Http/Controllers/ProfileController.php` | Backend logic |
| `resources/js/pages/profile.tsx` | React component |
| `routes/web.php` | Route definitions |
| `app/Models/User.php` | Model changes |
| `database/migrations/2025_01_21_000001_*` | Add cover_image_url |

## 🚀 How to Use

### Visit a Profile
```
URL: http://localhost:8000/@username
```

### Create Test User
```bash
php artisan tinker
User::factory()->create(['name' => 'john-doe']);
```

### Create Test Posts
```bash
php artisan tinker
$user = User::where('name', 'john-doe')->first();
$user->posts()->create([
    'title' => 'Test Post',
    'content' => json_encode([]),
    'slug' => 'test-post',
    'published_at' => now()
]);
```

## 🔐 Access Control

- ✅ Requires authentication (`auth` middleware)
- ✅ Requires email verification (`verified` middleware)
- ✅ Safe route model binding with username

## 📊 Database

### New Column
```sql
ALTER TABLE users ADD cover_image_url VARCHAR(255) NULLABLE;
```

### User Model
```php
// Route by username instead of ID
public function getRouteKeyName(): string {
    return 'name';
}
```

## 💾 Data Returned

### Profile Page Props
```php
[
    'profileUser' => [
        'id' => 1,
        'name' => 'john-doe',
        'bio' => 'My bio',
        'avatar_url' => 'https://...',
        'cover_image_url' => 'https://...',
    ],
    'followersCount' => 118,
    'following' => [User, User, ...],
    'isFollowing' => false,
    'publications' => [Publication, ...],
    'initialPosts' => PaginatedResponse<Post>
]
```

### Posts API Response
```json
{
    "data": [Post, Post, ...],
    "current_page": 1,
    "last_page": 10,
    "per_page": 10,
    "total": 100,
    "has_more": true
}
```

## 🎨 Styling

| Element | Class | Purpose |
|---------|-------|---------|
| Layout Grid | `md:grid-cols-100` | Responsive 100-column grid |
| Main Content | `col-span-50` | Center column width |
| Left Sidebar | `col-span-16` | Left column width |
| Right Sidebar | `col-span-34` | Right column width |
| Dark Mode | `dark:` prefix | All components have dark mode |

## ⚙️ Component Props

```typescript
interface ProfileProps {
  profileUser: User
  followersCount: number
  following: User[]
  isFollowing: boolean
  publications: Publication[]
  initialPosts: PaginatedResponse<Post>
}
```

## 🔄 State Hooks

```typescript
const [activeTab, setActiveTab] = useState('home')
const [isUserFollowing, setIsUserFollowing] = useState(isFollowing)
const { auth } = usePage<PageProps>().props
```

## 🎯 Conditionals

```typescript
// Check if viewing own profile
const isOwnProfile = auth.user.id === profileUser.id

// Show Edit button for own profile
if (isOwnProfile) {
    // [Edit profile] button
} else {
    // [Follow] [Share] [More] buttons
}
```

## 📱 Responsive Breakpoints

- **Desktop**: Full 100-column grid
- **Tablet**: Adjusted spacing, same layout
- **Mobile**: Stack layout or adjust columns

## 🧪 Testing

### Test Profile Loading
```bash
curl "http://localhost:8000/@john-doe"
```

### Test Posts API
```bash
curl "http://localhost:8000/@john-doe/posts?page=1"
```

### Test with Invalid User
```bash
curl "http://localhost:8000/@nonexistent-user"
# Returns 404
```

## ✅ Checklist

- [x] Backend routes created
- [x] ProfileController implemented
- [x] User model updated for username routing
- [x] Migration executed
- [x] React component built
- [x] TypeScript types added
- [x] Infinite scroll integrated
- [x] Dark mode support
- [x] ESLint passes
- [x] Build succeeds

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| 404 on profile URL | Check username in URL, must exist in DB |
| Posts not showing | Verify `published_at` is set to past date |
| Styling broken | Clear cache: Ctrl+Shift+Delete, rebuild: `npm run build` |
| Not authenticated | Login first, visit `/login` |
| Email not verified | Verify email, check migration |

## 🔗 Related Files

- Migrations: `database/migrations/`
- Controllers: `app/Http/Controllers/`
- Routes: `routes/web.php`
- Components: `resources/js/pages/`, `resources/js/components/`
- Types: `resources/js/types/index.d.ts`

## 📚 Documentation

- **Full Guide**: `PROFILE_PAGE_GUIDE.md`
- **Architecture**: `PROFILE_ARCHITECTURE.md`
- **This File**: `PROFILE_QUICK_REFERENCE.md`

## 🎓 Key Concepts

### Route Model Binding
```php
// Instead of ID, use username
Route::get('/@{user:name}', [ProfileController::class, 'show'])

// User model has this:
public function getRouteKeyName(): string { return 'name'; }
```

### Infinite Scroll
```typescript
// Uses IntersectionObserver API
// Auto-fetches next page when scrolled to bottom
// Appends to feed automatically
```

### Tab State
```typescript
// Active tab stored in component state
// Content switches based on activeTab value
// Each tab fetches different data
```

## 💡 Pro Tips

1. **Filter Posts by Date**: Only shows `published_at <= now()`
2. **Eager Load Relations**: Uses `with(['author', 'tags'])` for performance
3. **Cache Follower Count**: Can be optimized with caching
4. **Pagination**: Always paginate large datasets (10 per page here)
5. **Dark Mode**: All colors support dark mode

## 🔮 Future Features

- [ ] Follow/Unfollow action
- [ ] Edit profile
- [ ] User statistics
- [ ] Reading lists
- [ ] Social media links
- [ ] Pronouns field
- [ ] Pinned posts

## 📞 Support

For issues or questions:
1. Check `PROFILE_PAGE_GUIDE.md` for detailed docs
2. Check `PROFILE_ARCHITECTURE.md` for component structure
3. Review code comments in files
4. Check Laravel and React documentation

---

**Version**: 1.0
**Date**: January 21, 2025
**Status**: ✅ Ready for Production
