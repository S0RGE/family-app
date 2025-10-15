# Family Money Monitor

A comprehensive full-stack application to track family expenses, manage savings, plan large purchases, and get AI-powered financial recommendations. Features both web interface and Telegram bot control with real-time data synchronization.

## Features

- 💸 **Expense Tracking**: Manual entry and PDF receipt processing with OCR
- 💰 **Savings Management**: Track multiple savings goals and sources
- 🎯 **Purchase Planning**: Plan and track progress for large purchases with priority levels
- 🤖 **AI Recommendations**: Get personalized financial advice via OpenRouter API
- 📱 **Telegram Bot**: Full control via Telegram with family group support
- 📊 **Analytics**: Real-time spending analysis and category breakdowns
- 🔄 **Real-time Sync**: Instant updates across web and mobile interfaces
- 🛡️ **Secure**: Firebase authentication and data protection

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Vite, Chart.js
- **Backend**: Node.js, TypeScript, Express, Nodemon
- **Database**: Firebase Firestore (NoSQL)
- **AI**: OpenRouter API (multi-model access)
- **Bot**: Telegram Bot API with polling
- **File Processing**: PDF parsing with TypeScript support
- **Testing**: Jest with coverage reporting

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Firebase project with Firestore enabled
- Optional: Telegram Bot token and OpenRouter API key

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database in production mode
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `backend/firebase-service-account.json`

### 3. Environment Configuration

Create `backend/.env` file:

```env
PORT=3000
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Note**: The app works without API keys - they're only needed for Telegram bot and AI features.

### 4. Optional: Telegram Bot Setup

1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Copy the token to your `.env` file

### 5. Optional: OpenRouter Setup

1. Get API key from https://openrouter.ai
2. Add to your `.env` file

### 6. Run the Application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## Telegram Bot Commands

- `/expense 25 Food Lunch at restaurant` - Add expense
- `/save 200 Emergency fund` - Add savings
- `/balance` - Check current balance
- `/help` - Show all commands

## API Endpoints

### Expenses

- `POST /api/expenses` - Add expense
  ```json
  {
    "amount": 25.5,
    "category": "Food",
    "description": "Lunch",
    "familyMember": "John",
    "date": "2024-01-15"
  }
  ```
- `POST /api/expenses/upload-pdf` - Upload PDF receipt (multipart/form-data)
- `GET /api/expenses` - Get all expenses

### Savings

- `POST /api/savings` - Add savings
  ```json
  {
    "amount": 200,
    "source": "Salary",
    "description": "Monthly savings",
    "date": "2024-01-15"
  }
  ```
- `GET /api/savings` - Get all savings
- `GET /api/savings/total` - Get total savings amount

### Planning

- `POST /api/planning` - Create purchase plan
  ```json
  {
    "name": "New Laptop",
    "targetAmount": 1500,
    "currentSaved": 200,
    "targetDate": "2024-06-01",
    "priority": "high"
  }
  ```
- `PUT /api/planning/:id/progress` - Update plan progress
- `GET /api/planning` - Get all plans

### AI

- `POST /api/ai/recommendations` - Get AI financial recommendations
- `GET /api/ai/analysis` - Get spending analysis and category breakdowns

## Project Structure

```
family-app/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (Telegram bot)
│   │   └── index.ts         # Main server file
│   ├── firebase-service-account.json  # Firebase credentials
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/           # Vue pages
│   │   ├── services/        # API calls
│   │   ├── router/          # Vue Router
│   │   └── main.ts          # Vue app entry
│   └── package.json
└── package.json             # Root package.json
```

## Usage

1. **Web Interface**: Access at http://localhost:5173
   - Add expenses manually or upload PDF receipts
   - Track savings and view totals
   - Create and manage purchase plans
   - View AI recommendations and analytics

2. **Telegram Bot**:
   - Add the bot to your family group
   - Use commands to quickly log expenses and savings
   - Check balances on the go

## Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build
```

### Troubleshooting

**TypeScript Errors**: Ensure all dependencies are installed:

```bash
cd backend && npm install @types/pdf-parse
```

**Firebase Connection Issues**: Verify `firebase-service-account.json` exists and is valid.

**API Key Errors**: The app works without API keys - they're optional for enhanced features.

**Port Conflicts**: Change ports in `backend/.env` and `frontend/vite.config.ts` if needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
