import { gql } from '@apollo/client';

export const ADD_EXPENSE = gql`
  mutation addExpense(
    $title: String!
    $amount: Float!
    $dueDate: String!
    $category: String!
    $frequency: FrequencyType!
  ) {
    addExpense(
      title: $title
      amount: $amount
      dueDate: $dueDate
      category: $category
      frequency: $frequency
    ) {
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

export const UPDATE_EXPENSE = gql`
  mutation updateExpense(
    $_id: ID!
    $title: String
    $amount: Float
    $dueDate: String
    $category: String
    $frequency: FrequencyType
    $isPaid: Boolean
  ) {
    updateExpense(
      _id: $_id
      title: $title
      amount: $amount
      dueDate: $dueDate
      category: $category
      frequency: $frequency
      isPaid: $isPaid
    ) {
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

export const DELETE_EXPENSE = gql`
  mutation deleteExpense($_id: ID!) {
    deleteExpense(_id: $_id) {
      _id
    }
  }
`; 