import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useQuery } from '@apollo/client';
import { GET_EXPENSES } from '../utils/queries';
import { format, isSameDay, startOfDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

function ExpenseCalendar() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const { loading, data } = useQuery(GET_EXPENSES);

  const getExpensesForDate = (date) => {
    if (!data?.expenses) return [];
    
    const compareDate = startOfDay(new Date(date));
    
    return data.expenses.filter(expense => {
      if (!expense) return false;
      
      const expenseDate = startOfDay(new Date(expense.dueDate));
      return isSameDay(expenseDate, compareDate);
    });
  };

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const expenses = getExpensesForDate(date);
    if (!expenses || expenses.length === 0) return null;

    const totalAmount = expenses.reduce((sum, expense) => {
      return sum + (expense?.amount || 0);
    }, 0);
    
    return (
      <div className="calendar-expense">
        {expenses.length > 1 && <div className="expense-count">{expenses.length}</div>}
        <div className="expense-total">${totalAmount.toFixed(2)}</div>
      </div>
    );
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    
    const expenses = getExpensesForDate(date);
    if (!expenses || expenses.length === 0) return '';

    // Add different classes for recurring vs one-time expenses
    const hasRecurring = expenses.some(exp => exp?.isRecurring);
    const hasOneTime = expenses.some(exp => exp && !exp.isRecurring);
    
    if (hasRecurring && hasOneTime) return 'has-expenses has-mixed';
    if (hasRecurring) return 'has-expenses has-recurring';
    return 'has-expenses';
  };

  const handleDateClick = (date) => {
    setSelectedDate(startOfDay(date));
  };

  if (loading) return <div>Loading calendar...</div>;

  const selectedExpenses = getExpensesForDate(selectedDate);

  return (
    <div className="expense-calendar">
      <h2>Expense Calendar</h2>
      <div className="calendar-container">
        <Calendar 
          onChange={handleDateClick}
          value={selectedDate}
          tileContent={getTileContent}
          tileClassName={getTileClassName}
        />
      </div>
      {selectedExpenses && selectedExpenses.length > 0 && (
        <div className="selected-date-expenses">
          <h3>Expenses for {format(selectedDate, 'MMMM d, yyyy')}</h3>
          <ul>
            {selectedExpenses.map(expense => expense && (
              <li key={expense._id} 
                  className={`expense-item ${expense.isPaid ? 'paid' : 'unpaid'} ${expense.isRecurring ? 'recurring' : ''}`}>
                <span className="expense-title">
                  {expense.title}
                  {expense.isRecurring && <span className="recurring-badge">Recurring</span>}
                </span>
                <span className="expense-amount">${expense.amount?.toFixed(2) || '0.00'}</span>
                <span className="expense-category">{expense.category}</span>
                <span className="expense-status">
                  {expense.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ExpenseCalendar; 