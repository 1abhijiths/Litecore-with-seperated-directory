# LiteCore Shop - React Version

A modern React.js conversion of the LiteCore Shop frontend.

## Project Structure

```
react-app/
├── src/
│   ├── pages/
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── Home.jsx        # Home/dashboard page
│   │   ├── Products.jsx    # Products listing page
│   │   ├── Cart.jsx        # Shopping cart page
│   │   └── Account.jsx     # Account settings page
│   ├── components/
│   │   ├── Header.jsx      # Navigation header
│   │   └── ProtectedRoute.jsx # Auth protection wrapper
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # React entry point
│   ├── api.js              # API utilities (converted from auth.js)
│   └── index.css           # Global styles (converted from style.css)
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## Installation & Setup

1. Navigate to the react-app directory:
   ```bash
   cd react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Key Changes from Original

- **Routing**: React Router v6 for page navigation (replaces HTML href)
- **State Management**: React hooks (useState, useEffect) for component state
- **API Integration**: Modular `api.js` with exported functions
- **Authentication**: ProtectedRoute component for auth guarding
- **Styling**: Converted CSS remains the same, imported globally
- **Components**: Reusable Header and ProtectedRoute components

## Features

✅ User authentication (Login/Register)
✅ Protected routes
✅ Product catalog
✅ Shopping cart management
✅ Account settings (password change, delete account)
✅ Responsive design
✅ Modern React patterns (hooks, functional components)

## Environment

- **Node.js**: 16+
- **npm**: 8+
- **React**: 18.2.0
- **React Router**: 6.20.0
- **Vite**: 5.0.0

## API Configuration

The app connects to `http://localhost:8080` by default. Update the `BASE_URL` in `src/api.js` to change the backend URL.
