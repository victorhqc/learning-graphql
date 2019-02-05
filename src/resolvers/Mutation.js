const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserIdFromToken } = require('../utils');

const signToken = user => jwt.sign({ userId: user.id }, APP_SECRET);

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });

  const token = signToken(user);

  return { token, user };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error(WRONG_CREDENTIALS);
  }

  const isValidPassword = await bcrypt.compare(args.password, user.password);
  if (!isValidPassword) {
    throw new Error(WRONG_CREDENTIALS);
  }

  const token = signToken(user);

  return { token, user };
}

function post(root, args, context) {
  const userId = getUserIdFromToken(context);

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
}

const WRONG_CREDENTIALS = 'Wrong user or password';

module.exports = {
  signup,
  login,
  post,
};
