const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Recipes', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list recipes on GET', function() {
    // recall that we manually add some recipes to `Recipes`
    // inside `recipesRouter.js`. Later in this course,
    // once we're using a database layer, we'll seed
    // our database with test data, and we can form our expectations
    // about what GET should return, based on what we know about
    // the state of our database.
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        expect(res.body).to.have.length.of.at.least(1);

        // each item should be an object with key/value pairs
        // for `id`, `name` and `ingredients`.
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'name', 'ingredients');
        });
      });
  });

  it('should add a recipe on POST', function() {
    const newRecipe = {
        name: 'coffee', ingredients: ['ground coffee', 'hot water']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'name', 'ingredients');
        expect(res.body.name).to.equal(newRecipe.name);
        expect(res.body.ingredients).to.be.a('array');
        expect(res.body.ingredients).to.include.members(newRecipe.ingredients);
      });
  });

  it('should update recipes on PUT', function() {

    const updateData = {
      name: 'foo',
      ingredients: ['bizz', 'bang']
    };

    return chai.request(app)
      // first have to get recipes so have `id` for one we
      // want to update. Note that once we're working with databases later
      // in this course get the `id` of an existing instance from the database,
      // which will allow us to isolate the PUT logic under test from our
      // GET interface.
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it('should delete recipes on DELETE', function() {
    return chai.request(app)
      // first have to get recipes so have `id` for one we want
      // to delete. Note that once we're working with databases later
      // in this course, we'll be able get the `id` of an existing instance
      // directly from the database, which will allow us to isolate the DELETE
      // logic under test from our GET interface
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
