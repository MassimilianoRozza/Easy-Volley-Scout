> **Disclaimer:** This software is provided "as is", without warranty of any kind, express or implied. The author assumes no responsibility for any errors or data loss. Users are advised to regularly back up any critical data.

> **Note:** This project was developed with the assistance of an AI. The Android-specific features were implemented by the AI, as the original author is not an Android developer.

# Volleyball Scout App

[Leggi in Italiano](README.it.md)

A React-based web application designed for scouting volleyball matches. This application allows for athlete registration, real-time match scouting, generation of statistical reports, and exporting these reports to PDF.

## Features

*   **Athlete Management:** Register athletes with jersey numbers, names, and surnames.
*   **Match Scouting:** An intuitive interface for recording evaluations of fundamentals (Service, Reception, Defense, Attack) for each player.
*   **Auto-saving:** All counter modifications in the scouting interface are automatically saved.
*   **Dynamic Scouting Grid:** Displays fundamentals as rows and evaluation types (`#`, `+`, `-`, `=`) as columns, with quick increment/decrement buttons.
*   **Statistical Reporting:** Generates a comprehensive table of individual player statistics and aggregated team totals.
*   **PDF Export:** Reports can be exported as PDF files. This feature is supported on both web and Android builds. On Android, the file is saved to the `Documents` directory.
*   **Theming:** Supports both light and dark themes.

## Installation

### Prerequisites

*   [Node.js](https://nodejs.org/) and npm (or yarn) installed.
*   [Android Studio](https://developer.android.com/studio) for Android builds.

### Steps

1.  Clone the repository:
    ```bash
    git clone https://github.com/MassimilianoRozza/Easy-Volley-Scout.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd scout_app_web
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the Application (Development)

To run the application in development mode:

```bash
npm start
```

This will open the application in your browser at `http://localhost:3000`.

## Building for Production

### Web

To build the application for web production:

```bash
npm run build
```

This will create a `build` directory with the production-ready static files.

### Android

To build the application for Android:

1.  **Build the web application:**
    ```bash
    npm run build
    ```
2.  **Sync the changes with the Android project:**
    ```bash
    npx cap sync android
    ```
3.  **Open the project in Android Studio:**
    ```bash
    npx cap open android
    ```
4.  In Android Studio, you can build the APK using the menu: `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.

## Usage Manual

The application follows a clear, stage-based navigation:

1.  **Setup:** Enter the name of the match.
2.  **Athletes:** Register the athletes who will participate in the match.
3.  **Scouting:** Record the scouting data for each player using the grid.
4.  **Report:** View the statistical report and export it to PDF if needed.

## Limitations

*   The application is specifically designed for volleyball scouting.
*   The Android build requires permissions to write to the device's storage. The PDF is saved in the `Documents` folder.