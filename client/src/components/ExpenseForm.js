import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_EXPENSE, UPDATE_EXPENSE } from '../utils/mutations';
import { GET_EXPENSES } from '../utils/queries';
import { format } from 'date-fns';

function ExpenseForm({ expense, onCancel, isEditing }) {
  const [formState, setFormState] = useState({
    title: '',
    amount: '',
    dueDate: '',
    category: '',
    frequency: 'oneTime'
  });

  const [addExpense] = useMutation(ADD_EXPENSE);
  const [updateExpense] = useMutation(UPDATE_EXPENSE);

  useEffect(() => {
    if (expense) {
      setFormState({
        title: expense.title,
        amount: expense.amount,
        dueDate: format(new Date(expense.dueDate), 'yyyy-MM-dd'),
        category: expense.category,
        frequency: expense.frequency
      });
    }
  }, [expense]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        await updateExpense({
          variables: {
            _id: expense._id,
            ...formState,
            amount: parseFloat(formState.amount),
          },
          refetchQueries: [{ query: GET_EXPENSES }],
        });
        onCancel();
      } else {
        await addExpense({
          variables: {
            ...formState,
            amount: parseFloat(formState.amount),
          },
          refetchQueries: [{ query: GET_EXPENSES }],
        });
        // Clear form
        setFormState({
          title: '',
          amount: '',
          dueDate: '',
          category: '',
          frequency: 'oneTime'
        });
      }
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  return (
    <div className="expense-form">
      <h2>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            value={formState.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formState.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            name="frequency"
            value={formState.frequency}
            onChange={handleChange}
            required
          >
            <option value="oneTime">One Time</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formState.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Bills">Bills</option>
            <option value="Groceries">Groceries</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit">
            {isEditing ? 'Save Changes' : 'Add Expense'}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm; 