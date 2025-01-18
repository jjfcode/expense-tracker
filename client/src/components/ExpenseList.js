import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EXPENSES } from '../utils/queries';
import { DELETE_EXPENSE, UPDATE_EXPENSE } from '../utils/mutations';
import { format, parseISO, startOfDay } from 'date-fns';
import ExpenseForm from './ExpenseForm';

function ExpenseList() {
  const [editingExpense, setEditingExpense] = useState(null);
  const { loading, data, error } = useQuery(GET_EXPENSES);
  const [deleteExpense] = useMutation(DELETE_EXPENSE);
  const [updateExpense] = useMutation(UPDATE_EXPENSE);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      return format(startOfDay(parseISO(dateString)), 'MM/dd/yyyy');
    } catch (err) {
      console.error('Date formatting error:', dateString, err);
      return 'Invalid date';
    }
  };

  const formatFrequency = (expense) => {
    if (!expense) return '';
    
    const freq = expense.frequency || 'oneTime';
    const recurring = expense.isRecurring ? '(Recurring)' : '';
    
    switch (freq) {
      case 'oneTime':
        return 'One Time';
      case 'monthly':
        return `Monthly ${recurring}`;
      case 'quarterly':
        return `Quarterly ${recurring}`;
      default:
        return freq;
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      if (id.includes('-m') || id.includes('-q')) {
        alert('Cannot delete recurring instances. Please delete the original expense.');
        return;
      }

      await deleteExpense({
        variables: { _id: id },
        refetchQueries: [{ query: GET_EXPENSES }],
        awaitRefetchQueries: true
      });
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert(err.message);
    }
  };

  const togglePaid = async (expense) => {
    if (!expense || !expense._id) return;
    
    try {
      if (expense.isRecurring) {
        alert('Cannot update recurring instances. Please update the original expense.');
        return;
      }

      await updateExpense({
        variables: {
          _id: expense._id,
          isPaid: !expense.isPaid,
        },
        refetchQueries: [{ query: GET_EXPENSES }],
        awaitRefetchQueries: true
      });
    } catch (err) {
      console.error('Error updating expense:', err);
      alert(err.message);
    }
  };

  const handleEdit = (expense) => {
    if (!expense) return;
    
    // Check if this is a recurring instance
    if (expense.isRecurring) {
      alert('Cannot edit recurring instances. Please edit the original expense.');
      return;
    }
    
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Filter out any null or undefined expenses and ensure unique IDs
  const expenses = data?.expenses
    ?.filter(expense => expense && expense._id)
    ?.map(expense => ({
      ...expense,
      uniqueKey: expense.isRecurring ? `${expense._id}-${expense.dueDate}` : expense._id
    })) || [];

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      {editingExpense ? (
        <ExpenseForm 
          expense={editingExpense} 
          onCancel={handleCancelEdit}
          isEditing={true}
        />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Category</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.uniqueKey} className={expense.isRecurring ? 'recurring-expense' : ''}>
                <td>{expense.title}</td>
                <td>${expense.amount?.toFixed(2) || '0.00'}</td>
                <td>{formatDate(expense.dueDate)}</td>
                <td>{expense.category}</td>
                <td>{formatFrequency(expense)}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={expense.isPaid || false}
                    onChange={() => togglePaid(expense)}
                    disabled={expense.isRecurring}
                  />
                </td>
                <td>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(expense)}
                    disabled={expense.isRecurring}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(expense._id)}
                    disabled={expense.isRecurring}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExpenseList; 