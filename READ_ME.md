# 💰 Personal Finance Manager (Budget Tracker)

Welcome to the codebase for the Personal Finance Manager. This application is a full-stack web solution designed to help users track, analyze, and visualize their income and expenses to achieve better financial health.

## ✨ Features Overview

The application is designed around comprehensive financial tracking and insightful data visualization. Key features include:

*   **Income & Expense Tracking:** Seamlessly log, manage, and categorize all sources of income and all types of expenditures.
*   **Dashboard Visualization:** A central dashboard provides an immediate, high-level overview of financial health using charts for trend analysis.
*   **Budgeting & Goal Setting:** Tools to compare current spending against set budgets and analyze spending by category.
*   **Multi-Source Management:** Ability to track finances across different **Wallets** (e.g., checking, savings, cash).
*   **Historical Analysis:** View and compare financial data across different **Years** and **Months** to spot long-term trends.
*   **User Security:** Includes a dedicated login and authentication flow to keep user data private.

## 🏗️ Project Structure

The codebase follows a standard client-server architecture, separated into `frontend/` and `backend/`.

### 🌐 Frontend (`frontend/`)
This directory contains the entire user interface, built with React. It is responsible for the look, feel, and user interaction of the application.

*   **Components:** Highly modular components organized within `frontend/src/components/budgetApp/` handle specific UI pieces (e.g., `Card.jsx`, `Header.jsx`, `Sidebar.jsx`).
*   **Data Logic:** State management and reusable data structures are kept in `frontend/src/lib/` (e.g., `localFinanceStore.js`).
*   **Routing:** Dedicated routes handle the complex flow between different financial views (e.g., `Home/`, `Incomes/`, `Expenses/`).

### ⚙️ Backend (`backend/`)
This directory contains the server-side logic, responsible for handling data persistence, business rules, and exposing API endpoints.

*   **Server Core:** `server.js` acts as the main entry point for the API.
*   **Database:** Uses an SQLite database (`backend/db/dbBudget.db`) for persistent storage.
*   **Data Access Objects (DAOs):** Abstracted layers (`expense_dao.js`, `income_dao.js`, `users_dao.js`) manage all direct interactions with the database, keeping business logic separate from persistence logic.

### 💾 Assets
The `assets/` folder holds static images and visual elements used throughout the application.

## 🚀 Getting Started

### Prerequisites
*   Node.js and npm/yarn installed on your system.

### Installation Steps
1.  **Navigate to the root directory:**
    ```bash
    # Assuming you are already in the root directory
    # No specific setup commands provided, but generally:
    # npm install
    ```
2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```
3.  **Install Backend Dependencies:**
    ```bash
    cd ../backend
    npm install
    ```

### Running the Application
1.  **Start the Backend Server:** (This must be running to support the frontend API calls)
    ```bash
    # Example command, adjust based on package.json scripts
    node server.js
    ```
2.  **Start the Frontend Client:**
    ```bash
    cd frontend
    npm start
    ```
    The application should now be accessible in your browser (usually `http://localhost:3000`).

## 🛠️ Tech Stack Summary
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js, JavaScript/JSX | User Interface and Client Logic |
| **Backend** | Node.js, Express (Inferred) | API and Business Logic |
| **Database** | SQLite | Persistent Data Storage |
| **Styling** | CSS Modules/Styled Components (Inferred) | Component Styling |

---