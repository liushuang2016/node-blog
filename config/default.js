module.exports = {
  port: 3000,
  session: {
    secret: 'odjaoieuqio309829047!#%@*&^%$#',
    key: 'ss',
    maxAge: 1000 * 60 * 60 * 24 * 1
  },
  mongodb: 'mongodb://localhost:27017/blog',
  postSize: 12,
  commentSize: 20
}
