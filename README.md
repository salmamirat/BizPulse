# 📊 BizPulse

BizPulse is a mobile AI-powered financial management application for small businesses.  
It helps business owners manage income, expenses, employees, and use an AI assistant to analyze their financial situation and simulate hiring decisions.

---

## 🚀 Features

- 🔐 JWT Authentication
- 💰 Manage income and expenses
- 👨‍💼 Manage employees
- 📈 Financial dashboard
- 🤖 AI Chat Assistant
- 📊 Hiring simulation
- 🔄 REST API
- 🐳 Docker support

---

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo
- Expo Router
- Zustand
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt

### AI
- Claude API
- Function Calling
- Server Sent Events (Streaming)

---

## 📁 Project Structure

```
bizpulse/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   └── Dockerfile
│
├── mobile/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── assets/
│
├── docker-compose.yml
└── README.md
```

---

## 📱 Application Screens

- Login / Register
- Dashboard
- Transactions
- Employees
- AI Chat
- Profile

---

## ⚙️ Installation

### Clone repository

```bash
git clone https://github.com/your-username/bizpulse.git
cd bizpulse
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## 🐳 Docker

```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

Backend `.env`

```env
PORT=5000

DATABASE_URL=

JWT_SECRET=

CLAUDE_API_KEY=
```

---

## 📚 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Transactions
- GET /api/transactions
- POST /api/transactions
- PUT /api/transactions/:id
- DELETE /api/transactions/:id

### Employees
- GET /api/employees
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id

### AI
- POST /api/chat

---

## 🤖 AI Assistant

The AI assistant can:

- Analyze financial data
- Summarize revenues and expenses
- Simulate hiring a new employee
- Recommend actions based on company finances

---

## 📦 Database

Main tables:

- Company
- Employee
- Transaction
- Conversation
- Message

---

## 📄 Documentation

- Swagger / OpenAPI
- Postman Collection
- Prompt Journal
- UML Diagram

---

## 👩‍💻 Author

Salma Mirat

Projet Fil Rouge — Mobile Augmented AI