const { GraphQLServer } = require('graphql-yoga');

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL',
}];
let idCount = links.length;

const getLinkById = (links, id) => {
  const link = links.filter(link => link.id === id);

  if (link.length === 0) {
    return null;
  }

  return link[0];
};

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => getLinkById(links, args.id),
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const link = getLinkById(links, args.id);

      if (!link) {
        return null;
      }

      const updatedLink = {
        ...link,
        ...args,
      };

      links = links.map((link) => {
        if (link.id !== args.id) { return link; }

        return updatedLink;
      });

      return updatedLink;
    },
    deleteLink: (parent, args) => {
      const link = getLinkById(links, args.id);

      if (!link) {
        return null;
      }

      links = links.filter(link => link.id !== args.id);

      return link;
    },
  },
  // Link: {
  //   id: parent => parent.id,
  //   description: parent => parent.description,
  //   url: parent => parent.url,
  // }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log('Server is running on http://localhost:4000'));
