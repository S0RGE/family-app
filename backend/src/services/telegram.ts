import TelegramBot from 'node-telegram-bot-api';
import { db } from '../index';

class TelegramBotService {
  private bot: TelegramBot | null = null;

  init() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.log('Telegram bot token not provided');
      return;
    }

    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.setupCommands();
  }

  private setupCommands() {
    if (!this.bot) return;

    // Add expense command
    this.bot.onText(/\/expense (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const input = match![1];
      
      try {
        // Parse: amount category description
        const parts = input.split(' ');
        const amount = parseFloat(parts[0]);
        const category = parts[1] || 'Other';
        const description = parts.slice(2).join(' ') || 'Telegram expense';

        const expense = {
          amount,
          category,
          description,
          familyMember: msg.from?.first_name || 'Unknown',
          date: new Date(),
          createdAt: new Date()
        };

        await db.collection('expenses').add(expense);
        this.bot!.sendMessage(chatId, `✅ Added expense: $${amount} for ${category}`);
      } catch (error) {
        this.bot!.sendMessage(chatId, '❌ Error adding expense. Use: /expense 50 Food Groceries');
      }
    });

    // Add savings command
    this.bot.onText(/\/save (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const input = match![1];
      
      try {
        const parts = input.split(' ');
        const amount = parseFloat(parts[0]);
        const description = parts.slice(1).join(' ') || 'Telegram savings';

        const saving = {
          amount,
          source: 'Manual',
          description,
          date: new Date(),
          createdAt: new Date()
        };

        await db.collection('savings').add(saving);
        this.bot!.sendMessage(chatId, `💰 Added savings: $${amount}`);
      } catch (error) {
        this.bot!.sendMessage(chatId, '❌ Error adding savings. Use: /save 100 Emergency fund');
      }
    });

    // Get balance command
    this.bot.onText(/\/balance/, async (msg) => {
      const chatId = msg.chat.id;
      
      try {
        const savingsSnapshot = await db.collection('savings').get();
        const totalSavings = savingsSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

        const expensesSnapshot = await db.collection('expenses').get();
        const totalExpenses = expensesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

        this.bot!.sendMessage(chatId, 
          `💰 Total Savings: $${totalSavings.toFixed(2)}\n` +
          `💸 Total Expenses: $${totalExpenses.toFixed(2)}\n` +
          `📊 Net: $${(totalSavings - totalExpenses).toFixed(2)}`
        );
      } catch (error) {
        this.bot!.sendMessage(chatId, '❌ Error fetching balance');
      }
    });

    // Help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpText = `
🤖 Family Money Monitor Bot

Commands:
/expense <amount> <category> <description> - Add expense
/save <amount> <description> - Add savings
/balance - Check current balance
/help - Show this help

Examples:
/expense 25 Food Lunch at restaurant
/save 200 Emergency fund
      `;
      this.bot!.sendMessage(chatId, helpText);
    });
  }
}

export default new TelegramBotService();
