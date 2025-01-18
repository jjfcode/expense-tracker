import { gql } from '@apollo/client';

export const GET_EXPENSES = gql`
  query getExpenses {
    expenses {
      _id
      title
      amount
      dueDate
      category
      frequency
      isPaid
      createdAt
    }
  }
`;

export const GET_EXPENSE = gql`
  query getExpense($expenseId: ID!) {
    expense(_id: $expenseId) {
      _id
      title
      amount
      dueDate
      category
      isPaid
      createdAt
    }
  }
`; 