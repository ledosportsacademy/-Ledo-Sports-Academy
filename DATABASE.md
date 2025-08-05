# Database Population Guide

## Overview

This document provides instructions for populating the MongoDB database for the Ledo Sports Academy application with sample data. The application uses MongoDB Atlas as its database service.

## Prerequisites

- Node.js installed
- MongoDB Atlas account configured
- Environment variables set up in `.env` file

## Database Structure

The application uses the following collections:

1. **HeroSlide** - Slideshow items for the homepage
2. **Activity** - Sports activities and events
3. **Member** - Academy members (students, coaches, admins)
4. **Donation** - Donations received by the academy
5. **Expense** - Academy expenses
6. **Experience** - Notable experiences and achievements
7. **WeeklyFee** - Weekly fee payments by members
8. **Gallery** - Photo gallery items

## Populating the Database

We've created two scripts to help manage the database:

### 1. Database Population Script

The `populate-db.js` script will populate your MongoDB database with sample data for all collections.

**To run the script:**

```bash
node populate-db.js
```

This script will:
- Connect to your MongoDB database using credentials from your `.env` file
- Clear any existing data in all collections (optional - can be commented out)
- Create sample data for all collections
- Display progress and confirmation messages

### 2. Database Check Script

The `check-db.js` script allows you to verify the data in your MongoDB database.

**To run the script:**

```bash
node check-db.js
```

This script will:
- Connect to your MongoDB database
- Display the count of documents in each collection
- Show sample data from key collections

## Sample Data

The sample data includes:

- 3 hero slides for the homepage carousel
- 4 activities (tournaments, training sessions, etc.)
- 5 members with different roles
- 4 donations with various purposes
- 5 expenses across different categories
- 3 experiences/achievements
- 7 gallery items (with 5 marked as top items)
- Weekly fee records for student members

## Customizing the Data

To customize the sample data:

1. Open the `populate-db.js` file
2. Modify the data arrays in each creation function
3. Run the script again to update the database

## Troubleshooting

If you encounter errors when running the scripts:

1. Verify your MongoDB connection string in the `.env` file
2. Ensure your IP address is whitelisted in MongoDB Atlas
3. Check that all required fields match the schema definitions in the models
4. Look for validation errors in the console output

## Data Synchronization

The application includes synchronization logic that handles offline-to-online data flow. When the application is used offline, data is stored locally and then synchronized with the MongoDB database when connectivity is restored.