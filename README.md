# WeatherWise - Real-Time Weather Application

WeatherWise is a modern web application built with Next.js that allows users to search for cities and view real-time weather information. It provides current weather conditions, temperature, humidity, wind speed, sunrise/sunset times, and other relevant details in an intuitive and visually appealing interface.

![WeatherWise Screenshot](https://picsum.photos/800/450?random=1&blur=2&data-ai-hint=application%20screenshot) <!-- Replace with an actual screenshot if available -->

## Features

*   **City Search:** Search for cities worldwide.
*   **Dynamic Suggestions:** Get city suggestions as you type (min. 3 characters).
*   **Real-Time Weather Data:** View current temperature, "feels like" temperature, weather conditions (e.g., Sunny, Cloudy, Rainy).
*   **Detailed Information:** Access data on humidity, wind speed (m/s), pressure (hPa), visibility (km), and cloudiness (%).
*   **Astronomical Data:** See sunrise and sunset times for the selected city.
*   **Daily Forecast:** Min/max temperature for the day.
*   **Responsive Design:** Adapts to various screen sizes (desktop, tablet, mobile).
*   **Theming:** Light, Dark, and System theme options.
*   **Error Handling:** Graceful error messages for API key issues or data fetching failures.
*   **Loading States:** Clear loading indicators during data fetching.
*   **Toast Notifications:** Non-intrusive feedback for important events (e.g., errors).
*   **Optimized Icons:** Uses Lucide React icons for a clean and consistent look.

## Technology Stack

This project is built using a modern, robust technology stack:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components, Client Components)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:**
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [ShadCN UI](https://ui.shadcn.com/) (for UI components)
    *   CSS Variables for theming
*   **UI Components:**
    *   [Radix UI](https://www.radix-ui.com/) (primitives underlying ShadCN UI)
    *   [Lucide React](https://lucide.dev/) (icons)
*   **State Management & Data Fetching:**
    *   React Hooks (`useState`, `useEffect`, `useCallback`)
    *   Native `fetch` API
*   **API:** [WeatherAPI.com](https://www.weatherapi.com/)
*   **Linting & Formatting:** ESLint, TypeScript strict mode
*   **Package Manager:** npm

For a more detailed breakdown, please refer to the `DOCUMENTATION.md` file.

## Project Structure

The project follows a standard Next.js App Router structure:

*   `src/app/`: Core application pages, layouts, and global styles.
*   `src/components/`: Reusable UI components, including ShadCN UI and custom weather components.
*   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useMobile`).
*   `src/lib/`: Utility functions and API interaction logic (e.g., `weather-api.ts`).
*   `src/types/`: TypeScript type definitions.
*   `public/`: Static assets (if any).
*   `.env.local.example`: Example for environment variable setup.
*   `out/`: This directory will be generated after running `npm run build` and will contain the static HTML, CSS, and JavaScript files for deployment.

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js)
*   A WeatherAPI.com API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    *   You need an API key from [WeatherAPI.com](https://www.weatherapi.com/).
    *   Create a file named `.env.local` in the root of your project by copying the example:
        ```bash
        cp .env.local.example .env.local
        ```
    *   Open `.env.local` and add your WeatherAPI.com API key:
        ```
        NEXT_PUBLIC_WEATHERAPI_COM_API_KEY="YOUR_API_KEY_HERE"
        ```
        Replace `"YOUR_API_KEY_HERE"` with your actual key.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002` (as per your `package.json`).

2.  Open your browser and navigate to `http://localhost:9002`.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode with Turbopack.
*   `npm run build`: Builds the app for production. This will generate a static export in the `out/` directory.
*   `npm run start`: Starts a production server (after building, not applicable for static export).
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript type checking.
*   `npm run genkit:dev`: Starts the Genkit development server (if Genkit flows are used).
*   `npm run genkit:watch`: Starts the Genkit development server with watch mode.

## API Used

This application uses the [WeatherAPI.com](https://www.weatherapi.com/) service to fetch weather data and city suggestions. You must obtain a free API key from their website and configure it in the `.env.local` file as `NEXT_PUBLIC_WEATHERAPI_COM_API_KEY`.

## Deploying to GitHub Pages

This Next.js application has been configured for static export, making it suitable for deployment on GitHub Pages.

1.  **Build the Project:**
    Run the build command:
    ```bash
    npm run build
    ```
    This will generate a static version of your application in the `out` directory. This directory will contain the `index.html` file and other necessary static assets (CSS, JS).

2.  **Push to GitHub:**
    Commit and push the `out` directory (or its contents) to your GitHub repository. Make sure your repository is public if you're using a free GitHub account for GitHub Pages.
    *Note: It's common to have a separate branch (e.g., `gh-pages`) for the contents of the `out` directory, or to use GitHub Actions to automate the build and deployment process.*

3.  **Configure GitHub Pages:**
    *   Go to your repository settings on GitHub.
    *   Navigate to the "Pages" section.
    *   Under "Build and deployment", select "Deploy from a branch" as the source.
    *   Choose the branch you want to deploy from (e.g., `main` or `gh-pages`).
    *   Select the folder containing your static files (usually `/out` or `/docs` if you move the contents of `out` to a `docs` folder in the root of your deployment branch).
    *   Save the changes. GitHub will build and deploy your site.

4.  **(Optional) Configure `basePath` for Project Sites:**
    If your GitHub Pages site is a project site (e.g., `https://<username>.github.io/<repository-name>/`), you will need to configure the `basePath` in your `next.config.ts` file.
    For example, if your repository is named `my-weather-app`, you would add:
    ```javascript
    // next.config.ts
    const nextConfig = {
      output: 'export',
      basePath: '/my-weather-app', // Set this to your repository name
      // ... other configurations
    };
    ```
    After adding `basePath`, you'll need to rebuild (`npm run build`) and redeploy. Links and asset paths will then be prefixed correctly.

5.  **Access Your Site:**
    Your site should be available at `https://<username>.github.io/<repository-name>/` (if `basePath` is set for a project site) or `https://<username>.github.io/` (if it's a user/organization site and deployed from the root of the `main` branch, for example).

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where appropriate.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (if one exists, otherwise specify).

---

Happy Coding! ☀️🌧️❄️
