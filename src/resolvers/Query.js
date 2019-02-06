async function feed(parent, args, context, info) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {};

  const links = context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    last: args.last,
    orderBy: args.orderBy,
  });

  const count = context.prisma
    .linksConnection({ where })
    .aggregate()
    .count();

  // Fetch links & count in parallel. As normal await syntax would do it in sequence. This makes it
  // a bit faster.
  return {
    links: await links,
    count: await count,
  };
}

module.exports = {
  feed,
};
