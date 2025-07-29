# Market Seasonality Explorer - Documentation

## 🧾 Overview

Market Seasonality Explorer is a Next.js web application that allows users to:

- Filter financial market data by market type, season, and sector
- Visualize trends across different months
- Select custom date ranges using a responsive calendar
- Zoom into monthly, weekly, and daily views
- Compare sector performance side-by-side
- Export selected data to CSV

---

## 🧰 Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **UI Library:** Material UI (MUI)
- **Data Visualization:** Recharts
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel

---

## 📂 Folder Structure

```
market-seasonality-explorer/
├── app/
│   ├── layout.tsx         # App layout and theme setup
│   ├── page.tsx           # Main page with UI logic and components
│   └── globals.css        # Global styles
├── __tests__/
│   ├── Calendar.test.tsx  # Tests for Calendar UI logic
│   └── Export.test.tsx    # Tests for CSV export logic
├── public/                # Static assets
├── jest.config.js         # Jest setup
├── jest.setup.js          # Mock and global setup
├── README.md              # Project setup instructions
├── DOCUMENTATION.md       # (This file)
├── package.json           # Dependencies and scripts
```

---

## 🧩 Component Responsibilities

### `layout.tsx`

- Applies MUI theme using a custom dark/light mode toggle
- Wraps the application with HTML structure
- Injects global styles and Google Fonts
- Uses `ClientProviders` to manage client-only state

### `ColorModeContext`

- Provided via React Context API
- Enables theme toggling from anywhere in the app

### `page.tsx`

- **Main logic and UI:**
  - Filters for Market, Season, Sector
  - `Calendar` UI with month/week/day views
  - Chart generation using `Recharts`
  - Data comparison between selected and alternate sector
  - CSV download using a `Blob` and `URL.createObjectURL`
  - Dynamic rendering based on user selections
- **State Hooks Used:**
  - `useState` for local state (filters, date, theme)
  - `useEffect` for simulated async data fetches

### `Calendar` (in `page.tsx`)

- Renders views for month, week, and day
- Interactive day selection
- Highlights selected range and single dates
- Integrated with zoom functionality (in/out)

### `exportToCSV()`

- Builds CSV string from current dataset and comparison dataset
- Initiates download with appropriate headers and file name

---

## 🧪 Testing

Tests are located in the `__tests__/` folder.

### ✅ Tested Features

- Calendar rendering and interaction (month/week/day views)
- CSV export blob size and structure
- Theme toggle rendering

### 🧪 Testing Stack

- `jest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- Mocking `Blob`, `URL.createObjectURL`, and context where needed

---

## 🚀 Running Locally

Clone and run the project locally:

```bash
git clone https://github.com/your-username/market-seasonality-explorer.git
cd market-seasonality-explorer
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## 🌐 Live Deployment

Live version: [https://market-seasonality-explorer.vercel.app](https://market-seasonality-explorer.vercel.app)

---

## 📦 Future Improvements

- Backend integration for real-time market data
- User login and saved views
- Performance optimization and caching

---

For further clarification or walkthroughs, please refer to the demo video included in the submission.

