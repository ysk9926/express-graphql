var express = require('express');
var path = require('path');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var nunjucks = require('nunjucks');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {
  hello: () => {
    return 'Hello, Cloudtype!';
  },
};

var indexRouter = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');
nunjucks.configure('views', { 
  express: app,
  watch: true,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('GraphQL API server is running...');
