const express = require('express');
const app = express();

const shoppingList = require('./shoppingList');
const recipes = require('./recipes');

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// when requests come into `/shopping-list` or
// `/recipes`, we'll route them to the express
// router instances we've imported as `shoppingList`
// and `recipes`. Remember, these router instances
// act as modular, mini-express apps.
app.use('/shopping-list', shoppingList);
app.use('/recipes', recipes);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
