# 2026 Vision Board - Backend Integration Contracts

## API Contracts

### 1. Goals API

**Base Route:** `/api/goals`

#### Endpoints:
- `GET /api/goals` - Get all goals
  - Response: `[{ id, title, category, completed, createdAt }]`

- `POST /api/goals` - Create new goal
  - Request: `{ title, category }`
  - Response: `{ id, title, category, completed, createdAt }`

- `PUT /api/goals/:id` - Update goal
  - Request: `{ title?, category?, completed? }`
  - Response: Updated goal object

- `DELETE /api/goals/:id` - Delete goal
  - Response: `{ message: "Goal deleted" }`

### 2. Todos API

**Base Route:** `/api/todos`

#### Endpoints:
- `GET /api/todos` - Get all todos
  - Response: `[{ id, title, priority, dueDate, completed, createdAt }]`

- `POST /api/todos` - Create new todo
  - Request: `{ title, priority, dueDate }`
  - Response: `{ id, title, priority, dueDate, completed, createdAt }`

- `PUT /api/todos/:id` - Update todo
  - Request: `{ title?, priority?, dueDate?, completed? }`
  - Response: Updated todo object

- `DELETE /api/todos/:id` - Delete todo
  - Response: `{ message: "Todo deleted" }`

### 3. Mood Board API

**Base Route:** `/api/moodboard`

#### Endpoints:
- `GET /api/moodboard` - Get all collage images
  - Response: `[{ id, url, position: { x, y, rotation, zIndex }, width, height }]`

- `POST /api/moodboard` - Add image to collage
  - Request: `{ url, position: { x, y, rotation, zIndex }, width, height }`
  - Response: Created image object

- `PUT /api/moodboard/:id` - Update image position/size
  - Request: `{ position?, width?, height? }`
  - Response: Updated image object

- `DELETE /api/moodboard/:id` - Delete image
  - Response: `{ message: "Image deleted" }`

### 4. Gallery API

**Base Route:** `/api/gallery`

#### Endpoints:
- `GET /api/gallery` - Get all gallery items
  - Response: `[{ id, type, url, title, description, date }]`

- `POST /api/gallery` - Add gallery item
  - Request: `{ type, url, title, description, date }`
  - Response: Created gallery item

- `DELETE /api/gallery/:id` - Delete gallery item
  - Response: `{ message: "Gallery item deleted" }`

### 5. File Upload API

**Base Route:** `/api/upload`

#### Endpoints:
- `POST /api/upload` - Upload image/video file
  - Request: multipart/form-data with file
  - Response: `{ url: "file_path" }`

## Mock Data to Replace

### In `/app/frontend/src/mock.js`:
- `mockGoals` - Replace with API call to `/api/goals`
- `mockTodos` - Replace with API call to `/api/todos`
- `mockCollageImages` - Replace with API call to `/api/moodboard`
- `mockGalleryItems` - Replace with API call to `/api/gallery`

## Backend Implementation Plan

### 1. MongoDB Models:
- **Goal**: { title, category, completed, createdAt }
- **Todo**: { title, priority, dueDate, completed, createdAt }
- **MoodBoardImage**: { url, position: { x, y, rotation, zIndex }, width, height }
- **GalleryItem**: { type, url, title, description, date }

### 2. File Upload Strategy:
- Store uploaded files in `/app/backend/uploads/` directory
- Serve files statically via FastAPI
- Return relative URL paths to frontend

### 3. CORS Configuration:
- Already configured in server.py
- Allow all origins for development

## Frontend Integration Steps

1. Create API service file: `/app/frontend/src/services/api.js`
2. Replace mock data imports with API calls in each page component
3. Add loading states and error handling
4. Update CRUD operations to call backend APIs
5. Implement file upload functionality for Gallery and MoodBoard

## Testing Checklist

- [ ] Goals CRUD operations
- [ ] Todos CRUD operations with priority and dates
- [ ] MoodBoard drag, resize, rotate persistence
- [ ] Gallery upload and display
- [ ] File upload for images
- [ ] Data persistence across page refreshes
