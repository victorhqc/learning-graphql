const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => context.prisma.links(),
    link: () => {},
  },
  Mutation: {
    post: (root, args, context) => context.prisma.createLink({
      url: args.url,
      description: args.description,
    }),
    updateLink: (parent, args) => {},
    deleteLink: (parent, args) => {},
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url,
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});

server.start(() => console.log('Server is running on http://localhost:4000'));
