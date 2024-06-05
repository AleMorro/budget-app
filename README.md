# budget-app
React simple web application to manage expenses and income and see their trends.
## Introduction
Web site developed according to client-server logic. The project is divided into backend and frontend parts.
## Description
The application opens with a login screen where you can log in through email authentication and password. Once logged in, the page where the main component of the website is present will be opened.

The application allows for 3 main sections:
1. Home: presents a dashboard that summarizes the total value of various transactions. It is possible to filter the various cards to filter the results by time order (current Day, Month, Year)
2. Incomes: presents a screen where there is a form to enter the various information of the transaction you want to register. Below that is shown a report of all previous entries, which can always be filtered by current month, day, or year
3. Expenses: same Incomes organization

The application features other screens that have not yet been developed, such as Budget and Wallets.
## Technologies
The technology stack used depends directly on the classic division in which web applications are organized:
* Backend: sed to handle various database calls and to act as a server for client requests
   * Node.js: to run the application in a local environment
   * SQLite3: Database used for saving data and managing them
   * Passport: middleware for Node.js used for authentication

* Frontend: actual client part of the application that allows the user to make calls to the server via an interface
   * HTML5
   * CSS
   * React
   * Bootstrap
   * Apache Echarts: used for dynamic representation of various graphs
   * Axios: promise-based HTTP Client for node.js. Used to handle calls to the server by the client
   * date-fns: modern JavaScript date utility library
## Image of main application
Here an image to show an example of how the main view of the application is (Home.jsx component)
![screen](/ReadmeImg/budget-app_screenshot.png)
## Contributing
Contribution to budget-app is welcome! If you have an idea for a new feature or bug fix, please open an issue or a pull request.



