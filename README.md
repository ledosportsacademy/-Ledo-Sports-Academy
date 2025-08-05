# Ledo Sports Academy Management System

## Overview
This is a web-based management system for Ledo Sports Academy, featuring a MongoDB backend for data persistence. The system allows management of hero slides, activities, members, donations, expenses, experiences, weekly fees, and a photo gallery.

## Features
- Hero slideshow management with top 5 gallery photos integration
- Activities and events management
- Member registration and management
- Donation tracking and reporting
- Expense tracking and reporting
- Experience logging
- Weekly fee collection and tracking
- Photo gallery with top 5 selection for hero slideshow
- Dashboard with key metrics and statistics
- PDF report generation

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Additional libraries: Chart.js, html2pdf.js

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account

### Important Note on MongoDB Connection
The application requires a connection to MongoDB Atlas. If you see an error message like "API Request Failed: API Error: 404 Not Found" or "Cannot connect to server", it's likely because:

1. Your IP address is not whitelisted in MongoDB Atlas
2. The MongoDB connection credentials are incorrect
3. The server is not running

Please follow the setup instructions carefully, especially the MongoDB Atlas configuration step.

### Installation

1. Clone the repository
```
git clone <repository-url>
cd ledo-sports-academy
```

2. Install dependencies
```
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DB_USERNAME=ledosportsacedamy
DB_PASSWORD=4pgNMVdHpHeaWGrD
MONGODB_URI=mongodb+srv://ledosportsacedamy:4pgNMVdHpHeaWGrD@cluster0.sglzc8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

4. Configure MongoDB Atlas
- Log in to your MongoDB Atlas account
- Navigate to your cluster
- Go to Network Access in the security section
- Click "Add IP Address"
- Add your current IP address or use "Allow Access from Anywhere" (0.0.0.0/0) for development purposes
- Click "Confirm"

5. Run the application
```
npm start
```

6. Access the application
Open your browser and navigate to `http://localhost:3000`

### Testing MongoDB Connection
To test the MongoDB connection, run:
```
node test.js
```
This will attempt to connect to MongoDB and perform basic operations to verify that everything is working correctly.

## Troubleshooting

### MongoDB Connection Issues

1. **IP Whitelist Error**
   - Error: "Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted."
   - Solution: Follow step 4 in the installation instructions to whitelist your IP address in MongoDB Atlas.

2. **404 Not Found Errors**
   - Error: "API Request Failed: API Error: 404 Not Found"
   - Cause: The server is running but cannot connect to MongoDB, so the API endpoints are not properly initialized.
   - Solution: Check the server console for MongoDB connection errors and ensure your IP is whitelisted.

3. **Server Not Running**
   - Error: "Failed to fetch" or "Cannot connect to server"
   - Solution: Make sure the server is running with `npm start` or `node server.js`.

4. **Checking Server Status**
   - You can check the server and database status by visiting `/api/health-check` endpoint.
   - This will return a JSON object with the server and database connection status.

## API Endpoints

### Hero Slides
- GET `/api/hero-slides` - Get all hero slides
- POST `/api/hero-slides` - Create or update a hero slide
- DELETE `/api/hero-slides/:id` - Delete a hero slide

### Activities
- GET `/api/activities` - Get all activities
- POST `/api/activities` - Create or update an activity
- DELETE `/api/activities/:id` - Delete an activity

### Members
- GET `/api/members` - Get all members
- POST `/api/members` - Create or update a member
- DELETE `/api/members/:id` - Delete a member

### Donations
- GET `/api/donations` - Get all donations
- POST `/api/donations` - Create or update a donation
- DELETE `/api/donations/:id` - Delete a donation

### Expenses
- GET `/api/expenses` - Get all expenses
- POST `/api/expenses` - Create or update an expense
- DELETE `/api/expenses/:id` - Delete an expense

### Experiences
- GET `/api/experiences` - Get all experiences
- POST `/api/experiences` - Create or update an experience
- DELETE `/api/experiences/:id` - Delete an experience

### Weekly Fees
- GET `/api/weekly-fees` - Get all weekly fees
- GET `/api/weekly-fees/:memberId` - Get weekly fees for a specific member
- POST `/api/weekly-fees/:memberId` - Add a payment for a member
- PUT `/api/weekly-fees/:memberId/:paymentId` - Update a payment
- DELETE `/api/weekly-fees/:memberId/:paymentId` - Delete a payment

### Gallery
- GET `/api/gallery` - Get all gallery items
- GET `/api/gallery/top5` - Get top 5 gallery items
- POST `/api/gallery` - Create or update a gallery item
- PUT `/api/gallery/toggle-top5/:id` - Toggle top 5 status for a gallery item
- PUT `/api/gallery/update-order` - Update order of top 5 gallery items
- DELETE `/api/gallery/:id` - Delete a gallery item

## Frontend Integration
The frontend uses the API.js file to communicate with the backend. This file provides functions for fetching data from the API and updating the UI accordingly.

## License
This project is licensed under the MIT License - see the LICENSE file for details.