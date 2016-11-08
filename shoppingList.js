const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {storage} = require('./storage');

// we're going to add some items to storage
// so there's some data to look at
storage.add('beans', 2.5);
storage.add('tomatoes', 5);
storage.add('peppers', 3);

router.get('/', (req, res) => {
  res.json(storage.getItems());
});

router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body` 
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = storage.add({name: req.body.name, budget: req.body.budget});
  res.status(201).json(item);
});


router.delete('/:id', (req, res) => {
  storage.deleteItem(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  const updatedItem = storage.updateItem({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });
  res.status(204).json(updatedItem);
})

module.exports = router;