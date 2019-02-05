const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Mutation = require('resolvers/Mutation');
const Query = require('resolvers/Query');

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    ...Query,
  },
  Mutation,
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    prisma,
  }),
});

server.start(() => console.log('Server is running on http://localhost:4000'));
