const express = require('express');
const app = express();

const shoppingList = require('./shoppingList');

app.use('/items', shoppingList);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
