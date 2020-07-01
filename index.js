const { ApolloServer, gql } = require('apollo-server');
const todoModule = require('./modules/todo.js');
const userModule = require('./modules/user.js');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type todo {
    id: ID!
    content: String!
    completed: Boolean!
  }
  type user {
    id: ID!
    username: String!
    password: String!
  }
  type Query {
    todoList: [todo]!
  }
  type updateResponse {
    success: Boolean!
    todoList: [todo]!
  }
  type tokenResponse {
    success: Boolean!
    token: String!
  }
  type Mutation {
    signUp(username: String!, password: String!):tokenResponse!
    signIn(username: String!, password: String!):tokenResponse!
    addTodo(content: String): updateResponse!
    changeCompleted(id: ID!): updateResponse!
    deleteTodo(id: ID!): updateResponse!
    editTodo(id: ID!, content: String!):updateResponse!
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    todoList: async (_, __, context) => {
      let currentUser = context.user;
      let getList = await todoModule.todoList(currentUser.id);
      return getList;
    }
  },
  Mutation: {
    signUp: async (_, { username, password }) => {
      let user = await userModule.signUp(username, password);
      let token = '';
      if (user) {
        token = userModule.generateToken(user);
      }
      return { success: user ? true : false, token: token };
    },
    signIn: async (_, { username, password }) => {
      let user = await userModule.signIn(username, password);
      let token = '';
      if (user) {
        token = userModule.generateToken(user);
      }
      return { success: user ? true : false, token: token };
    },
    addTodo: async (_, { content }, context) => {
      let currentUser = context.user;
      let status = await todoModule.create(currentUser.id, content);
      return { success: status, todoList: await todoModule.todoList(currentUser.id) };
    },
    changeCompleted: async (_, { id }, context) => {
      let currentUser = context.user;
      let status = await todoModule.changeCompleted(currentUser.id, id);
      return { success: status, todoList: await todoModule.todoList(currentUser.id) };
    },
    deleteTodo: async (_, { id }, context) => {
      let currentUser = context.user;
      let status = await todoModule.deleteTodo(currentUser.id, id);
      return { success: status, todoList: await todoModule.todoList(currentUser.id) };
    },
    editTodo: async (_, { id, content }, context) => {
      let currentUser = context.user;
      let status = await todoModule.editTodo(currentUser.id, id, content);
      return { success: status, todoList: await todoModule.todoList(currentUser.id) };
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let query = req.body.query;
    if (query.indexOf('signIn(') > 0 || query.indexOf('signUp(') > 0) {
      return; 
    } else {
      const token = req.headers.authorization || '';
      const user = userModule.getUser(token);
      if (!user) throw new Error('you don not have token'); 
      return { user };
    }
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});