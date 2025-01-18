const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum FrequencyType {
    oneTime
    monthly
    quarterly
  }

  type Expense {
    _id: ID
    title: String
    amount: Float
    dueDate: String
    category: String
    frequency: FrequencyType
    isPaid: Boolean
    createdAt: String
    isRecurring: Boolean
  }

  type Query {
    expenses: [Expense]
    expense(_id: ID!): Expense
  }

  type Mutation {
    addExpense(
      title: String!
      amount: Float!
      dueDate: String!
      category: String!
      frequency: FrequencyType!
    ): Expense

    updateExpense(
      _id: ID!
      title: String
      amount: Float
      dueDate: String
      category: String
      frequency: FrequencyType
      isPaid: Boolean
    ): Expense

    deleteExpense(_id: ID!): Expense
  }
`;

module.exports = typeDefs; 