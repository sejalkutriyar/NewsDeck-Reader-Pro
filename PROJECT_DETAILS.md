# Project Details: NewsProject

This document provides a deep dive into the architecture, workflow, and technology stack of the NewsProject application.

## 1. Project Overview

**NewsProject** is a React Native mobile application built with Expo that allows users to browse news articles from various categories. It features a clean UI, offline capabilities, and a bookmarking system.

## 2. Directory Structure

The project follows a standard Expo Router structure:

### Root Directory
- **`app/`**: The heart of the application. Contains all screens and routing logic.
- **`components/`**: Reusable UI elements used across different screens.
- **`utils/`**: Helper functions, API logic, and storage management.
- **`assets/`**: Static files like images and fonts.
- **`styles/`**: Global styles or theme definitions (if applicable).

### Key Folders & Files

#### `app/` (Navigation & Screens)
- **`(tabs)/`**: Contains the main tab-based navigation.
    - **`index.tsx`**: The **Home Screen**. Displays the news feed with categories.
    - **`saved.tsx`**: The **Saved Screen**. Shows bookmarked articles.
    - **`settings.tsx`**: The **Settings Screen** (if implemented).
    - **`_layout.tsx`**: Defines the Tab Bar layout and icons.
- **`article/`**:
    - **`[id].tsx`**: The **Article Detail Screen**. Uses dynamic routing (`[id]`) to show specific article details.
- **`_layout.tsx`**: The root layout of the app, handling the main stack navigation.

#### `components/` (UI Components)
- **`ArticleCard.tsx`**: Displays a single news article summary (image, title, source) in a list.
- **`CategoryPill.tsx`**: A clickable chip component for selecting news categories (e.g., "Sports", "Tech").
- **`SearchBar.tsx`**: Input component for searching news articles.

#### `utils/` (Logic & Data)
- **`newsApi.ts`**: Handles all interactions with the NewsData.io API.
    - Fetches news by category or search term.
    - Implements **caching** to save API calls and support offline mode.
    - Handles **rate limiting** (429 errors) gracefully.
- **`storage.ts`**: Manages local data persistence using `AsyncStorage`.
    - Functions to save, remove, and retrieve bookmarked articles.
- **`mockData.ts`**: Contains fallback data for testing or when the API is unavailable.

## 3. Application Workflow

### User Flow
1.  **Launch**: The app opens to the **Home Screen** (`app/(tabs)/index.tsx`).
2.  **Browse**:
    - The user sees a list of "Top Headlines".
    - They can tap **Category Pills** (e.g., "Business") to filter the feed.
    - They can use the **Search Bar** to find specific topics.
3.  **Read**:
    - Tapping an article card navigates to the **Article Detail Screen** (`app/article/[id].tsx`).
    - The user can read the full content (or a summary) and see the image.
4.  **Bookmark**:
    - On the detail screen or card, the user can tap a "Save" icon.
    - The article is saved locally via `storage.ts`.
5.  **Review Saved**:
    - The user navigates to the **Saved Tab** (`app/(tabs)/saved.tsx`).
    - All bookmarked articles are listed here, available even offline.

### Data Flow
1.  **Fetching**: `Home Screen` calls `fetchNews()` from `newsApi.ts`.
2.  **Caching**: `newsApi.ts` checks `AsyncStorage` for valid cached data before hitting the network.
    - If cached data exists and is fresh (< 10 mins), it's returned immediately.
    - If not, an HTTP request is made to `newsdata.io`.
3.  **Display**: Data is passed to a `FlatList` which renders `ArticleCard` components.
4.  **Persistence**: Bookmarks are stored as a JSON string in `AsyncStorage`.

## 4. Tech Stack & Libraries

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core** | **React Native** | Mobile UI framework. |
| **Framework** | **Expo** | Development platform and build tool. |
| **Language** | **TypeScript** | Type-safe JavaScript for better code quality. |
| **Navigation** | **Expo Router** | File-system based routing (similar to Next.js). |
| **Networking** | **Axios** | Promise-based HTTP client for API requests. |
| **Storage** | **AsyncStorage** | Key-value storage system for persisting data locally. |
| **Icons** | **Expo Vector Icons** | Icon set (Ionicons, MaterialIcons, etc.). |
| **API** | **NewsData.io** | External service providing news content. |

## 5. Key Features Implementation

### Offline Caching
The `newsApi.ts` file implements a custom caching strategy. When news is fetched successfully, it's saved to `AsyncStorage` with a timestamp. Subsequent requests check this timestamp; if it's within the validity window (e.g., 10 minutes), the cached data is used, saving API quota and enabling offline access.

### Bookmark System
The bookmarking feature relies on `AsyncStorage` to persist a list of article objects. The `Saved` screen reads this list on focus to display the user's collection.

### Rate Limit Handling
The API client (`newsApi.ts`) detects `429 Too Many Requests` errors. If triggered, it calculates the retry time from headers, pauses requests, and serves cached content if available, preventing the app from breaking under heavy usage.
