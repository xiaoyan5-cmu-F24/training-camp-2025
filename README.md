# E-commerce Product List Project

Hi there! 👋 This is my project submission for the **2025 Engineering Training Camp**. It's a responsive e-commerce product list page built with React and TypeScript. 

I've learned a lot while building this, especially about handling performance with large lists and managing complex state. Below is a breakdown of what I built and how I tackled the requirements!

## 🚀 How to Start the Project

1.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(Make sure you also go into the `server` folder and install dependencies there too if needed, but the main app is in the root!)*

2.  **Start the backend server:**
    The app needs the mock API to run.
    ```bash
    node server/index.js
    ```

3.  **Start the frontend:**
    Open a new terminal and run:
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to the Local URL provided by Vite (usually `http://localhost:5173`).

---

## 🛠 Tech Stack

*   **Framework:** React (v18) + TypeScript
*   **Build Tool:** Vite
*   **UI Library:** Ant Design (antd)
*   **State Management:** Redux Toolkit
*   **Routing/API:** REST API (Mock Node server)
*   **Performance:** react-window (Virtual Scrolling), lodash.debounce

---

## 📝 Implementation Details

Here is how I implemented the requirements:

### 1. Product Filtering, Sorting, and Pagination
I decided to handle the filtering and sorting on the client-side for a snappier feel since we are fetching a specific dataset.
*   **Filtering:** I added a search bar that filters products by name or description.
*   **Sorting:** You can sort by Price (Low/High) or Name (A-Z/Z-A).
*   **Pagination:** I implemented a standard pagination bar at the bottom. It updates the `currentPage` in the Redux store, and the list re-renders to show the correct slice of products.

### 2. State Management (Redux Toolkit)
I used **Redux Toolkit** because it's the standard for modern React apps.
*   `productsSlice`: Handles fetching products (`createAsyncThunk`), tracking loading status (`idle`, `loading`, `failed`), and storing the current search/sort parameters.
*   `cartSlice`: Manages the shopping cart state (adding items, opening/closing the drawer).

### 3. Debounce (Bonus Feature)
To prevent the app from freezing or doing too much work while the user is typing, I used `lodash.debounce`.
*   **How I did it:** I wrapped the search dispatch action in a debounced function with a 500ms delay. This way, the Redux state only updates after the user stops typing, but I kept a local state for the input field so the UI doesn't feel laggy!

### 4. Skeleton Loading (Bonus Feature)
Nobody likes staring at a blank screen! 👻
*   **Implementation:** When the Redux status is `loading`, I conditionally render the Ant Design `<Skeleton />` component instead of the product grid. It gives the user a nice visual cue that data is on the way.

### 5. Virtual Scrolling (Bonus Feature) ⚡
This was the most challenging but exciting part! The requirement was to optimize scrolling for large datasets.
*   **The Problem:** Rendering hundreds of DOM nodes slows down the browser.
*   **The Solution:** I used `react-window` (specifically `VariableSizeList`).
*   **My Approach:**
    *   I used `AutoSizer` to detect the screen width.
    *   I calculated how many columns fit on the screen (responsive!) to group products into "rows".
    *   I passed these calculated rows to the virtual list.
    *   **Tricky Part:** The "Header" (Search bars + Recommendations) is actually the *first row* of the virtual list! This ensures the whole page scrolls smoothly together, rather than having nested scrollbars.

### 6. "You May Also Like" (Bonus Feature)
I wanted to simulate an AI recommendation engine.
*   **Logic:** I created a `Recommendations` component that randomly selects 4 products from the list.
*   **Interactivity:** I added a "Refresh" button that re-shuffles the seed, so users can generate new recommendations on the fly.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── ProductList.tsx       # Main virtual list container
│   ├── ProductCard.tsx       # Individual product item
│   ├── ProductFilter.tsx     # Search and Sort controls
│   ├── Recommendations.tsx   # "You May Also Like" section
│   └── CartDrawer.tsx        # Shopping cart sidebar
├── store/
│   ├── productsSlice.ts      # Redux logic for products
│   ├── cartSlice.ts          # Redux logic for cart
│   └── store.ts              # Store configuration
└── App.tsx                   # Main layout
```

Thanks for checking out my code! I tried to keep it clean and modular. Let me know if you have any feedback! 😊