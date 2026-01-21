# Profile Page - Component Architecture

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              APP LAYOUT WRAPPER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                          BREADCRUMB: Profile > @username                     │
├─────────────────────┬─────────────────────────┬──────────────────────────────┤
│                     │                         │                              │
│   LEFT SIDEBAR      │    MAIN CONTENT         │      RIGHT SIDEBAR           │
│   (16 cols)         │    (50 cols)            │      (34 cols)               │
│                     │                         │                              │
│   Reserved for      │  ┌─────────────────┐   │  ┌──────────────────────┐    │
│   future use        │  │  Cover Image    │   │  │   FOLLOWING          │    │
│                     │  │  (gradient bg)  │   │  │   ┌────────────────┐ │    │
│                     │  └─────────────────┘   │  │   │ User Avatar    │ │    │
│                     │                         │  │   │ @username      │ │    │
│                     │  ┌─────────────────┐   │  │   └────────────────┘ │    │
│                     │  │ Avatar ┌─────┐  │   │  │        ...           │    │
│                     │  │ Name   │Logo │  │   │  │   See all button     │    │
│                     │  │ Pronoun└─────┘  │   │  └──────────────────────┘    │
│                     │  │ 118 followers   │   │                              │
│                     │  │ Bio text...     │   │  ┌──────────────────────┐    │
│                     │  │ [Follow] [...]  │   │  │ PUBLICATIONS         │    │
│                     │  └─────────────────┘   │  │ ┌──────────────────┐ │    │
│                     │                         │  │ │Publication Name  │ │    │
│                     │  ┌─────────────────┐   │  │ └──────────────────┘ │    │
│                     │  │ TAB NAVIGATION  │   │  │        ...           │    │
│                     │  │ [Home] [Lists]  │   │  └──────────────────────┘    │
│                     │  │ [About]         │   │                              │
│                     │  └─────────────────┘   │                              │
│                     │                         │                              │
│                     │  HOME TAB CONTENT:      │                              │
│                     │  ┌─────────────────┐   │                              │
│                     │  │   POST CARD 1   │   │                              │
│                     │  │   [Infinite     │   │                              │
│                     │  │    Scroll Feed] │   │                              │
│                     │  │   POST CARD 2   │   │                              │
│                     │  │                 │   │                              │
│                     │  │   ...           │   │                              │
│                     │  └─────────────────┘   │                              │
│                     │                         │                              │
└─────────────────────┴─────────────────────────┴──────────────────────────────┘
```

## Component Hierarchy

```
Profile (Main Component)
├── Head (Inertia)
├── AppLayout (Layout wrapper)
│   ├── Breadcrumbs
│   └── Main Content Grid
│       ├── Left Sidebar (empty)
│       ├── Center Column
│       │   ├── Profile Header Section
│       │   │   ├── Cover Image div
│       │   │   ├── Avatar Component
│       │   │   │   ├── AvatarImage
│       │   │   │   └── AvatarFallback (initials)
│       │   │   ├── User Info
│       │   │   │   ├── Name (h1)
│       │   │   │   ├── Pronouns (p)
│       │   │   │   └── Followers Count (p)
│       │   │   ├── Bio (p)
│       │   │   └── Action Buttons
│       │   │       └── Button (Follow/Edit)
│       │   │
│       │   └── Tabs Component
│       │       ├── TabsList (navigation)
│       │       │   ├── TabsTrigger (Home)
│       │       │   ├── TabsTrigger (Lists)
│       │       │   └── TabsTrigger (About)
│       │       │
│       │       ├── TabsContent (home)
│       │       │   └── InfiniteScrollFeed
│       │       │       └── PostCard (repeated)
│       │       │
│       │       ├── TabsContent (lists)
│       │       │   └── Empty State
│       │       │
│       │       └── TabsContent (about)
│       │           ├── Bio Section
│       │           ├── Publications List
│       │           └── Joined Date
│       │
│       └── Right Sidebar
│           ├── Following Section
│           │   ├── Section Title
│           │   ├── User Cards (Avatar + Link)
│           │   └── See All Button
│           │
│           └── Publications Section
│               ├── Section Title
│               └── Publication Cards
```

## Data Flow Diagram

```
USER NAVIGATES TO /@USERNAME
           │
           ▼
    PROFILE ROUTE
    (@{user:name})
           │
           ▼
ProfileController::show()
           │
           ├─► Query User by name
           ├─► Count followers
           ├─► Get following users (limit 5)
           ├─► Check if current user follows
           ├─► Get publications
           ├─► Get published posts (page 1, limit 10)
           │
           ▼
    Inertia::render('profile', $props)
           │
           ▼
    React Component receives props
           │
           ├─► Extract auth.user
           ├─► Extract profileUser
           ├─► Extract initialPosts
           │
           ▼
    Component renders with data
           │
           ├─► Display profile header
           ├─► Display tabs
           └─► Display sidebar

USER SCROLLS TO BOTTOM OF FEED
           │
           ▼
   InfiniteScrollFeed detects intersection
           │
           ▼
   Axios GET /@{user:name}/posts?page=2
           │
           ▼
ProfileController::getPosts($page=2)
           │
           ├─► Query user posts for page 2
           │
           ▼
   Return JSON response
           │
           ▼
   Component appends new posts to feed
```

## Props Interface

```typescript
interface ProfileProps {
  profileUser: User              // User data
  followersCount: number         // Count of followers
  following: User[]              // Users this person follows
  isFollowing: boolean          // Is current user following this user
  publications: Publication[]   // User's publications
  initialPosts: PaginatedResponse<Post>  // First page of posts
}

interface PageProps {
  auth: {
    user: User                  // Current authenticated user
  }
}
```

## State Management

```typescript
// Local component state
const [activeTab, setActiveTab] = useState('home')
const [isUserFollowing, setIsUserFollowing] = useState(isFollowing)

// From Inertia
const { auth } = usePage<PageProps>().props
const isOwnProfile = auth.user.id === profileUser.id
```

## Conditional Rendering

### Edit vs. Follow Buttons
```
IS OWN PROFILE?
├─ YES: Show [Edit profile] button → /settings/profile
└─ NO:  Show [Follow] [Share] [More] buttons
```

### Content Based on Tab
```
TAB = 'home'  → InfiniteScrollFeed (posts)
TAB = 'lists' → Empty state placeholder
TAB = 'about' → Bio, Publications, Joined date
```

### Display Based on Data
```
profileUser.bio exists?
├─ YES: Display bio section
└─ NO:  Skip bio display

publications.length > 0?
├─ YES: Show publications card
└─ NO:  Hide publications card

following.length > 0?
├─ YES: Show following card
└─ NO:  Hide following card
```

## Event Handlers

### Current
```typescript
setActiveTab(value)           // Tab change
handleFollowClick()           // Toggle following state (stubbed)
```

### Ready for Implementation
```typescript
// In handleFollowClick() - when connected to API:
POST /api/follow
PUT /api/profile
DELETE /api/unfollow
```

## API Endpoints Used

### Server-Side Rendering (SSR)
```
GET /@{user:name}
Response includes:
{
  profileUser: {},
  followersCount: 118,
  following: [{...}, ...],
  isFollowing: false,
  publications: [{...}, ...],
  initialPosts: {data: [{...}], ...}
}
```

### Client-Side (AJAX)
```
GET /@{user:name}/posts?page=2
Response:
{
  data: [{post}, {post}, ...],
  current_page: 2,
  last_page: 10,
  per_page: 10,
  total: 100,
  has_more: true
}
```

## Styling Classes Used

### Layout
- `flex flex-1 flex-col` - Main flex container
- `grid auto-rows-min gap-4 md:grid-cols-100` - Responsive grid
- `col-span-16/50/34` - Column distribution

### Spacing
- `mb-6` - Margin bottom
- `pb-6` - Padding bottom
- `gap-4` - Gap between items
- `mt-4` - Margin top

### Colors & Borders
- `border-neutral-200 dark:border-neutral-800` - Border color
- `text-neutral-900 dark:text-neutral-50` - Text color
- `bg-neutral-50 dark:bg-neutral-900` - Background

### Typography
- `text-2xl font-bold` - Heading
- `text-sm` - Small text
- `font-semibold` - Emphasized text

### Interactive
- `hover:opacity-75` - Link hover
- `rounded-lg` - Border radius
- `px-2/px-4` - Horizontal padding

## Component Dependencies

```
Profile Component
├─ @inertiajs/react (Head, Link, usePage)
├─ lucide-react (Icons: MoreHorizontal, Share2)
├─ react (useState)
├─ @/components/infinite-scroll-feed
├─ @/components/ui/tabs
├─ @/components/ui/avatar
├─ @/components/ui/button
├─ @/layouts/app-layout
└─ @/types (TypeScript interfaces)
```

## Performance Optimizations

1. **Pagination**: 10 posts per page
2. **Lazy Loading**: Posts load on scroll
3. **Query Optimization**: Uses `with(['author', 'tags'])`
4. **Conditional Rendering**: Only renders visible tabs
5. **Avatar Caching**: Uses fallback initials if no image

## Accessibility Features

- Semantic HTML (h1, p, div)
- ARIA-friendly button states
- Tab navigation support
- Alt text on images
- Color contrast meets WCAG standards

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

---

**Architecture Version**: 1.0
**Last Updated**: January 21, 2025
