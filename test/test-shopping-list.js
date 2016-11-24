const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

let server;

// create the server afresh for each test in this module
beforeEach(function() {
  server = require('../server');
});

// close down the server at the end of each test in this module
afterEach(function() {
  server.close();
});

describe('Shopping List', function() {

  // show that GET /shopping-list returns array
  // of objects with right keys
  it('should list items on GET', function(done) {
    // recall that we manually add some recipes to `Recipes`
    // inside `recipesRouter.js`. Later in this course,
    // once we're using a database layer, we'll seed
    // our database with test data, and we can form our expectations
    // about what GET should return, based on what we know about
    // the state of our database.
    chai.request(server)
      .get('/shopping-list')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        res.body.should.have.length.of.at.least(1);

        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('id', 'name', 'checked');
        });
        done();
      });
  });

  // show that POST requests to /shopping-list with right data
  // yield a 201 and object representing the new shopping list
  // item.
  it('should add an item on POST', function(done) {
    const newItem = {name: 'coffee', checked: false};
    chai.request(server)
      .post('/shopping-list')
      .send(newItem)
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'checked');
        res.body.name.should.equal(newItem.name);
        res.body.checked.should.equal(newItem.checked);
        res.body.id.should.not.be.null;
      });
      done();
  });


  // show that PUT requests to /shopping-list/:id with right data
  // yield a 200 code and object representing updated shopping list
  // item
  it('should update items on PUT', function(done) {
    chai.request(server)
      // first have to get
      .get('/shopping-list')
      .end(function(err, res) {
        const updated = {
          name: 'foo',
          checked: true,
          id: res.body[0].id
        };
        chai.request(server)
        // send it
          .put(`/shopping-list/${res.body[0].id}`)
          .send(updated)
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.name.should.equal(updated.name);
            res.body.checked.should.equal(updated.checked);
            res.body.id.should.equal(updated.id);
          });
      })
      done();
  });

  // show that DELETE requests to /shopping-list/:id yield a 204. Later,
  // once we learn about databases, we can check to see if the shopping
  // list item with `id` has been deleted.
  it('should delete items on DELETE', function(done) {
    chai.request(server)
      // first have to get
      .get('/shopping-list')
      .end(function(err, res) {
        chai.request(server)
          .delete(`/shopping-list/${res.body[0].id}`)
          .end(function(err, res) {
            res.should.have.status(204);
          });
      });
      done();
  });
});
