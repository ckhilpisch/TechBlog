const User = require('./user');
const Blog = require('./blog')

User.hasMany(Blog, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Blog.belongsTo(User, {
  foreignKey: 'user_id'
});

Blog.hasMany(Comment, {
  foreignKey: 'comment_id'
})

Comment.belongsTo(Blog, {
  foreignKey: 'blog_id',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
})

module.exports = { User, Blog };
