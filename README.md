# events-app-backend

Backend for an events app written in Node with Express as server and MongoDB as the database

Core requirements: Authentication / Authorization + Basic CRUD functionality

Required fields: Name, Location, Summary, Date / time

Extensions: Basic search functionality, Dual token / cookie auth, Password hashing (BCrypt)

Post-submission changes: Add "sameSite=none" (together with 'secure' flag) on auth cookie to keep Chrome happy, additional validation
