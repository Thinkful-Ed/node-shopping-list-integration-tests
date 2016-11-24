const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

let server;

beforeEach(function() {
  // create the server afresh for each test in this module
  server = require('../server');
});

afterEach(function() {
  // close down the server at the end of each test in this module
  server.close();
});

describe('Recipes', function() {

  it('should list recipes on GET', function(done) {
    // recall that we manually add some recipes to `Recipes`
    // inside `recipesRouter.js`. Later in this course,
    // once we're using a database layer, we'll seed
    // our database with test data, and we can form our expectations
    // about what GET should return, based on what we know about
    // the state of our database.
    chai.request(server)
      .get('/recipes')
      .end(function(err, res) {

        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        res.body.should.have.length.of.at.least(1);

        // each item should be an object with key/value pairs
        // for `id`, `name` and `ingredients`.
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('id', 'name', 'ingredients');
        });
        done();
      });
  });

  it('should add a recipe on POST', function(done) {
    const newRecipe = {
        name: 'coffee', ingredients: ['ground coffee', 'hot water']};
    chai.request(server)
      .post('/recipes')
      .send(newRecipe)
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'ingredients');
        res.body.name.should.equal(newRecipe.name);
        res.body.ingredients.should.be.a('array');
        res.body.ingredients.should.include.members(newRecipe.ingredients);
      });
      done();
  });

  it('should update recipes on PUT', function(done) {
    chai.request(server)
      // first have to get recipes so have `id` for one we
      // want to update. Note that once we're working with databases later
      // in this course get the `id` of an existing instance from the database,
      // which will allow us to isolate the PUT logic under test from our
      // GET interface.
      .get('/recipes')
      .end(function(err, res) {
        const updated = {
          name: 'foo',
          ingredients: ['bizz', 'bang'],
          id: res.body[0].id
        };

        chai.request(server)
        // send it
          .put(`/recipes/${updated.id}`)
          .send(updated)
          .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.include.keys('id', 'name', 'ingredients');
              res.body.name.should.equal(updated.name);
              res.body.id.should.equal(updated.id);
              res.body.ingredients.should.include.members(updated.ingredients);
          });
      });
      done();
  });

  it('should recipes on DELETE', function(done) {
    chai.request(server)
      // first have to get recipes so have `id` for one we want
      // to delete. Note that once we're working with databases later
      // in this course, we'll be able get the `id` of an existing instance
      // directly from the database, which will allow us to isolate the DELETE
      // logic under test from our GET interface
      .get('/recipes')
      .end(function(err, res) {
        chai.request(server)
            .delete(`/recipes/${res.body[0].id}`)
            .end(function(err, res) {
                res.should.have.status(204);
            });
      });
      done();
  });

});