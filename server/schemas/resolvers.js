const Expense = require('../models/Expense');
const { addMonths, addQuarters, parseISO, startOfDay } = require('date-fns');
const mongoose = require('mongoose');

const resolvers = {
  Query: {
    expenses: async () => {
      try {
        const baseExpenses = await Expense.find().sort({ dueDate: 1 });
        console.log('Base expenses from DB:', baseExpenses);
        
        let allExpenses = baseExpenses.map(expense => ({
          ...expense.toObject(),
          dueDate: new Date(expense.dueDate).toISOString(),
          createdAt: new Date(expense.createdAt).toISOString()
        }));

        // Add recurring expenses
        baseExpenses.forEach(expense => {
          if (expense.frequency === 'monthly' || expense.frequency === 'quarterly') {
            const iterations = expense.frequency === 'monthly' ? 3 : 2;
            const addFunction = expense.frequency === 'monthly' ? addMonths : addQuarters;
            
            for (let i = 1; i <= iterations; i++) {
              const nextDate = addFunction(new Date(expense.dueDate), i);
              if (nextDate >= new Date()) {
                allExpenses.push({
                  ...expense.toObject(),
                  _id: `${expense._id}-${expense.frequency === 'monthly' ? 'm' : 'q'}${i}`,
                  dueDate: nextDate.toISOString(),
                  isRecurring: true
                });
              }
            }
          }
        });

        return allExpenses.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } catch (err) {
        console.error('Error in expenses resolver:', err);
        return [];
      }
    },
    expense: async (parent, { _id }) => {
      const expense = await Expense.findById(_id);
      return {
        ...expense._doc,
        dueDate: new Date(expense.dueDate).toISOString(),
        createdAt: new Date(expense.createdAt).toISOString()
      };
    }
  },
  Mutation: {
    addExpense: async (parent, args) => {
      // Ensure the date is set to start of day
      const dueDate = startOfDay(new Date(args.dueDate));
      
      const expense = await Expense.create({
        ...args,
        dueDate
      });
      
      return {
        ...expense._doc,
        dueDate: dueDate.toISOString(),
        createdAt: expense.createdAt.toISOString()
      };
    },
    updateExpense: async (parent, args) => {
      try {
        let expenseId = args._id;
        
        if (args._id.includes('-m') || args._id.includes('-q')) {
          expenseId = args._id.split('-')[0];
          
          if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            throw new Error('Invalid expense ID');
          }
        }

        const expense = await Expense.findByIdAndUpdate(
          expenseId,
          {
            ...args,
            _id: expenseId,
            dueDate: args.dueDate ? new Date(args.dueDate) : undefined
          },
          { new: true }
        );

        if (!expense) {
          throw new Error('Expense not found');
        }

        return {
          ...expense._doc,
          dueDate: new Date(expense.dueDate).toISOString(),
          createdAt: new Date(expense.createdAt).toISOString()
        };
      } catch (err) {
        console.error('Error updating expense:', err);
        throw new Error(err.message || 'Error updating expense');
      }
    },
    deleteExpense: async (parent, { _id }) => {
      try {
        let expenseId = _id;
        
        if (_id.includes('-m') || _id.includes('-q')) {
          expenseId = _id.split('-')[0];
          
          if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            throw new Error('Invalid expense ID');
          }
        }

        const expense = await Expense.findByIdAndDelete(expenseId);
        if (!expense) {
          throw new Error('Expense not found');
        }

        return {
          ...expense._doc,
          dueDate: new Date(expense.dueDate).toISOString(),
          createdAt: new Date(expense.createdAt).toISOString()
        };
      } catch (err) {
        console.error('Error deleting expense:', err);
        throw new Error(err.message || 'Error deleting expense');
      }
    }
  }
};

module.exports = resolvers; 