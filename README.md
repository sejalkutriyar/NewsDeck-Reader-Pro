# NewsProject

A modern, feature-rich news reader application built with React Native and Expo. Stay updated with the latest headlines from around the world, categorized for your convenience.

## Features

- **Top Headlines**: Get the latest news from various categories like Business, Technology, Sports, and more.
- **Search Functionality**: Easily find articles on specific topics.
- **Categories**: Browse news by specific interests.
- **Offline Reading**: Cached news feed allows reading even when offline.
- **Save Articles**: Bookmark your favorite articles to read later.
- **Smooth Animations**: Enjoy a polished user experience with fluid transitions and interactions.

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: StyleSheet (React Native)
- **API**: [NewsData.io](https://newsdata.io/)
- **State Management**: React Context (for Bookmarks)
- **Storage**: AsyncStorage (for Caching & Bookmarks)

## Getting Started

### Prerequisites

- Node.js installed
- Expo Go app on your mobile device (iOS/Android) or an emulator.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/sejalkutriyar/NewsDeck-Reader-Pro.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd NewsProject
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

1.  Start the development server:
    ```bash
    npx expo start
    ```
2.  Scan the QR code with the Expo Go app (Android) or Camera app (iOS).

## Project Structure

- **app/**: Contains the main application screens and navigation logic (Expo Router).
- **components/**: Reusable UI components like `ArticleCard`, `SearchBar`, etc.
- **utils/**: Utility functions for API calls, storage, and data management.
- **assets/**: Images and other static assets.

## License

This project is licensed under the MIT License.
