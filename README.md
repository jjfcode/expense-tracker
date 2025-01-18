# Expense Tracker

A full-stack MERN application for tracking expenses with recurring payment support, built with GraphQL and React.

## Features

- 💰 Track expenses with title, amount, due date, and category
- 🔄 Support for:
  - One-time payments
  - Monthly recurring expenses
  - Quarterly recurring expenses
- 📅 Calendar view with:
  - Daily expense totals
  - Visual indicators for expense types
  - Expense details on date selection
- ✅ Mark expenses as paid/unpaid
- 📋 List view with expense management

## Tech Stack

### Frontend
- React
- Apollo Client
- React Calendar
- date-fns

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- GraphQL with Apollo Server

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/expense-tracker.git
```
2. Install dependencies:

```bash
cd expense-tracker
npm install
```

## Install server dependencies
```bash
cd server
npm install
```

## Install client dependencies
```bash
cd client
npm install
```

3. Create a `.env` file in the server directory

```bash
env
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
PORT=3001
```

## Running the Application

1. Start the server:

```bash
cd server
npm run dev
```

2. Start the client:

```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- GraphQL Playground: http://localhost:3001/graphql

## Project Structure
```
expense-tracker/
├── client/                # React frontend
│   └── src/
│       ├── components/    # React components
│       └── utils/         # GraphQL queries & mutations
└── server/               # Node.js backend
    ├── models/           # MongoDB models
    ├── schemas/          # GraphQL schemas
    └── config/           # Database configuration
```

## GraphQL Schema

### Types
```graphql
type Expense {
  _id: ID
  title: String
  amount: Float
  dueDate: String
  category: String
  frequency: FrequencyType
  isPaid: Boolean
  createdAt: String
  isRecurring: Boolean
}

enum FrequencyType {
  oneTime
  monthly
  quarterly
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
