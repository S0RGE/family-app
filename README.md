# Family Money Monitor

A comprehensive application to track family expenses, manage savings, plan large purchases, and get AI-powered financial recommendations. Features both web interface and Telegram bot control.

## Features

- 💸 **Expense Tracking**: Manual entry and PDF receipt processing
- 💰 **Savings Management**: Track and accumulate money
- 🎯 **Purchase Planning**: Plan and track progress for large purchases
- 🤖 **AI Recommendations**: Get personalized financial advice
- 📱 **Telegram Bot**: Control everything via Telegram
- 📊 **Analytics**: Visual spending analysis and insights

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Chart.js
- **Backend**: Node.js, TypeScript, Express
- **Database**: Firebase Firestore
- **AI**: OpenAI GPT
- **Bot**: Telegram Bot API
- **File Processing**: PDF parsing

## Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `backend/firebase-service-account.json`

### 3. Environment Variables

Create `backend/.env` file:

```env
PORT=3000
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Telegram Bot Setup

1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Copy the token to your `.env` file

### 5. OpenAI Setup

1. Get API key from https://platform.openai.com
2. Add to your `.env` file

### 6. Run the Application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3000
```

## Telegram Bot Commands

- `/expense 25 Food Lunch at restaurant` - Add expense
- `/save 200 Emergency fund` - Add savings
- `/balance` - Check current balance
- `/help` - Show all commands

## API Endpoints

### Expenses
- `POST /api/expenses` - Add expense
- `POST /api/expenses/upload-pdf` - Upload PDF receipt
- `GET /api/expenses` - Get all expenses

### Savings
- `POST /api/savings` - Add savings
- `GET /api/savings` - Get all savings
- `GET /api/savings/total` - Get total savings

### Planning
- `POST /api/planning` - Create purchase plan
- `PUT /api/planning/:id/progress` - Update plan progress
- `GET /api/planning` - Get all plans

### AI
- `POST /api/ai/recommendations` - Get AI recommendations
- `GET /api/ai/analysis` - Get spending analysis

## Project Structure

```
family-app/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── index.ts         # Main server file
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
