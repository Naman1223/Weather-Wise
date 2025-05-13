# WeatherWise Application Documentation

## 1. Project Overview

WeatherWise is a web application that allows users to search for cities and view real-time weather information. It provides current weather conditions, temperature, humidity, wind speed, sunrise/sunset times, and other relevant details.

## 2. Technology Stack

This project is built using the following technologies:

*   **Framework:** [Next.js](https://nextjs.org/) (v15.2.3) - A React framework for building server-rendered and statically generated web applications.
    *   **App Router:** Used for routing and layouts.
    *   **Server Components & Client Components:** Leveraged for optimal rendering strategies.
*   **Language:** [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that adds static typing.
*   **Styling:**
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
    *   [ShadCN UI](https://ui.shadcn.com/) - A collection of re-usable UI components built with Radix UI and Tailwind CSS.
    *   **CSS Variables:** Used for theming (light/dark modes) in `src/app/globals.css`.
*   **UI Components:**
    *   [Radix UI](https://www.radix-ui.com/) - Primitives for building accessible design systems and web applications (used as the foundation for ShadCN UI components).
    *   [Lucide React](https://lucide.dev/) - A library of beautiful and consistent icons.
*   **State Management & Data Fetching:**
    *   React Hooks (`useState`, `useEffect`, `useCallback`) for component-level state management.
    *   The native `fetch` API for making HTTP requests to the weather API.
*   **API:** [WeatherAPI.com](https://www.weatherapi.com/) - Provides weather data and city suggestions.
    *   An API key is required for this service. It should be stored in an environment variable named `NEXT_PUBLIC_WEATHERAPI_COM_API_KEY`. See the `.env.local.example` file for setup instructions.
*   **Linting & Formatting:**
    *   ESLint (as configured by Next.js default setup).
    *   TypeScript's strict mode for type checking.
*   **Development Server:** Next.js development server (`next dev`).
*   **Build Tool:** Next.js (`next build`).
*   **Package Manager:** npm (as defined in `package.json`).
*   **Fonts:** Geist Sans and Geist Mono (loaded via `next/font/google` in `src/app/layout.tsx`).

## 3. Project Structure

The project follows a standard Next.js App Router structure:

*   `src/app/`: Contains the main application pages and layouts.
    *   `layout.tsx`: The root layout component for the entire application. It sets up global styles, fonts, and theme providers.
    *   `page.tsx`: The main home page component where users interact with the weather search functionality.
    *   `globals.css`: Contains global CSS styles, Tailwind CSS base directives, and theme (color) definitions using CSS variables.
*   `src/components/`: Contains reusable UI components.
    *   `ui/`: Directory for ShadCN UI components (e.g., Button, Card, Input).
    *   `weather/`: Custom components specifically built for the weather application:
        *   `city-search-form.tsx`: Handles city input and suggestion display.
        *   `weather-display.tsx`: Renders the fetched weather information.
        *   `weather-icon.tsx`: Displays an appropriate weather icon based on conditions.
    *   `theme-provider.tsx`: A client component that wraps the application to enable theme switching functionality using `next-themes`.
    *   `theme-toggle.tsx`: A client component that provides a UI control (dropdown button) for users to switch between light, dark, and system themes.
*   `src/hooks/`: Contains custom React hooks.
    *   `use-toast.ts`: A hook for managing and displaying toast notifications.
    *   `use-mobile.tsx`: A utility hook to detect if the application is being viewed on a mobile-sized screen.
*   `src/lib/`: Contains utility functions and library-like modules.
    *   `utils.ts`: General utility functions, notably `cn` for merging Tailwind CSS classes.
    *   `weather-api.ts`: Contains functions (`fetchWeatherData`, `fetchCitySuggestions`) for interacting with the WeatherAPI.com service.
*   `src/types/`: Contains TypeScript type definitions.
    *   `weather.ts`: Defines interfaces for the structure of data received from WeatherAPI.com (e.g., `WeatherData`, `CitySuggestion`).
*   `public/`: For static assets. (Currently, no custom assets are placed here by the application logic).
*   `.env.local.example`: An example file demonstrating how to set up the `NEXT_PUBLIC_WEATHERAPI_COM_API_KEY` environment variable. Users should copy this to `.env.local` and insert their actual API key.
*   `next.config.ts`: The Next.js configuration file. Includes settings for image remote patterns and TypeScript/ESLint build behavior.
*   `tailwind.config.ts`: The configuration file for Tailwind CSS, defining theme extensions, plugins, and content sources.
*   `components.json`: Configuration file for ShadCN UI, specifying style, component paths, etc.
*   `package.json`: Lists project dependencies, scripts for running, building, and linting the application.
*   `tsconfig.json`: The TypeScript compiler configuration file.

## 4. How it Works (High-Level Flow)

1.  **Application Load (`src/app/layout.tsx`, `src/app/page.tsx`):**
    *   The `RootLayout` initializes the HTML structure, applies global fonts, and wraps the application with `ThemeProvider` (for theme management) and `Toaster` (for notifications).
    *   The `HomePage` component (`src/app/page.tsx`) renders. It manages the primary state: `weatherData`, `isLoading`, `error`, and `selectedCityName`.
    *   Upon mounting, `HomePage` checks if the `NEXT_PUBLIC_WEATHERAPI_COM_API_KEY` is present. If not, it displays an error toast.

2.  **City Search (`src/components/weather/city-search-form.tsx`):**
    *   The user types a city name into the `Input` field within the `CitySearchForm`.
    *   Once the input query reaches at least 3 characters, the `debouncedFetchSuggestions` function is called.
    *   This function makes an API request to `fetchCitySuggestions` (in `src/lib/weather-api.ts`), which queries the WeatherAPI.com `/search.json` endpoint.
    *   A list of `CitySuggestion` objects is returned and displayed below the input field.
    *   When the user clicks on a suggestion, the `handleSuggestionClick` method in `CitySearchForm` is invoked. This method then calls the `onCitySelect` prop (which is `handleCitySelect` in `HomePage`) with the chosen city data.

3.  **Fetching Weather Data (`src/app/page.tsx`, `src/lib/weather-api.ts`):**
    *   The `handleCitySelect` function in `HomePage` is triggered.
    *   It sets `isLoading` to `true`, clears previous weather data and errors, and updates `selectedCityName`.
    *   It then calls `fetchWeatherData` (from `src/lib/weather-api.ts`) using the latitude and longitude of the selected city.
    *   `fetchWeatherData` constructs a URL for the WeatherAPI.com `/forecast.json` endpoint (requesting 1 day of forecast, which includes current weather details).
    *   The API response is parsed. If successful, a `WeatherData` object is returned. If there's an API error or network issue, an error object is returned.

4.  **Displaying Weather (`src/app/page.tsx`, `src/components/weather/weather-display.tsx`):**
    *   Back in `HomePage`, if `fetchWeatherData` returns valid data, it's stored in the `weatherData` state, and `isLoading` is set to `false`.
    *   The `WeatherDisplay` component receives the `weatherData` as a prop.
    *   `WeatherDisplay` deconstructs the data and renders:
        *   Location name and country.
        *   Current weather condition text.
        *   A dynamic weather icon (using the `WeatherIcon` component).
        *   Current temperature and "feels like" temperature.
        *   A grid of additional details: Min/Max temperature for the day, humidity, wind speed (converted to m/s), pressure, visibility, and cloudiness.
        *   Sunrise and sunset times for the day.
    *   The `WeatherIcon` component (`src/components/weather/weather-icon.tsx`) selects an appropriate Lucide icon based on the `weatherApiConditionCode` and the `isDay` flag from the API data.

5.  **Loading and Error States (`src/app/page.tsx`):**
    *   `HomePage` conditionally renders UI elements based on `isLoading` and `error` states:
        *   If `isLoading` is true, a loading spinner and message are shown.
        *   If `error` is not null (and not loading), an error message with a `WifiOff` icon is displayed.
        *   If there's no data, no error, and not loading (initial state), a placeholder message prompts the user to search.
    *   Toast notifications (`useToast`) provide non-intrusive feedback, especially for errors like the missing API key or failed data fetches.

6.  **Theming (`src/components/theme-provider.tsx`, `src/components/theme-toggle.tsx`, `src/app/globals.css`):**
    *   The application uses `next-themes` library for theme management.
    *   `ThemeProvider` is a client component that wraps the root of the application in `layout.tsx`, providing context for theme changes.
    *   `ThemeToggle` is a client component that presents a dropdown menu allowing users to select "Light", "Dark", or "System" themes.
    *   The actual theme colors (backgrounds, text colors, accent colors, etc.) are defined as CSS HSL variables in `src/app/globals.css` under `:root` (for light theme) and `.dark` (for dark theme) selectors. Tailwind CSS utility classes then consume these variables.

## 5. Code Documentation (Detailed)

For detailed, line-by-line explanations of the code, please refer to the JSDoc comments embedded directly within the source files (`.ts` and `.tsx`). This documentation is co-located with the code to ensure it remains up-to-date and contextually relevant.

Key files with extensive JSDoc comments include:

*   `src/app/page.tsx`
*   `src/app/layout.tsx`
*   `src/components/weather/city-search-form.tsx`
*   `src/components/weather/weather-display.tsx`
*   `src/components/weather/weather-icon.tsx`
*   `src/lib/weather-api.ts`
*   `src/hooks/use-toast.ts`
*   `src/types/weather.ts`
*   Other components and utility files also contain relevant documentation.
