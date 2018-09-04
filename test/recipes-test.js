const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

const expect = chai.expect;


describe("Recipes", function() {
    // Before our tests run, we activate the server. Our `runServer`
    // function returns a promise, and we return the that promise by
    // doing `return runServer`. If we didn't return a promise here,
    // there's a possibility of a race condition where our tests start
    // running before our server has started.
    before(function() {
      return runServer();
    });
  
    // although we only have one test module at the moment, we'll
    // close our server at the end of these tests. Otherwise,
    // if we add another test module that also has a `before` block
    // that starts our server, it will cause an error because the
    // server would still be running from the previous tests.
    after(function() {
      return closeServer();
    });
  
    // test strategy:
    //   1. make request to `/shopping-list`
    //   2. inspect response object and prove has right code and have
    //   right keys in response object.
    it("should list items on GET", function() {
      // for Mocha tests, when we're dealing with asynchronous operations,
      // we must either return a Promise object or else call a `done` callback
      // at the end of the test. The `chai.request(server).get...` call is asynchronous
      // and returns a Promise, so we just return it.
      return chai
        .request(app)
        .get("/recipes")
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("array");
  
          // because we create three items on app load
          expect(res.body.length).to.be.at.least(1);
          // each item should be an object with key/value pairs
          // for `id`, `name` and `checked`.
          const expectedKeys = ["id", "name", "ingredients"];
          res.body.forEach(function(item) {
            expect(item).to.be.a("object");
            expect(item).to.include.keys(expectedKeys);
          });
        });
    });
  
    // test strategy:
    //  1. make a POST request with data for a new item
    //  2. inspect response object and prove it has right
    //  status code and that the returned object has an `id`
    it("should add an item on POST", function() {
      const newItem = { name: "coffee", ingredients: "coffee grinds" };
      return chai
        .request(app)
        .post("/recipes")
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("id", "name", "ingredients");
          expect(res.body.id).to.not.equal(null);
          // response should be deep equal to `newItem` from above if we assign
          // `id` to it from `res.body.id`
          expect(res.body).to.deep.equal(
            Object.assign(newItem, { id: res.body.id })
          );
        });
    });
  
    // test strategy:
    //  1. initialize some update data (we won't have an `id` yet)
    //  2. make a GET request so we can get an item to update
    //  3. add the `id` to `updateData`
    //  4. Make a PUT request with `updateData`
    //  5. Inspect the response object to ensure it
    //  has right status code and that we get back an updated
    //  item with the right data in it.
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
            .send(updateData)
        })
        .then(function(res) {
          res.should.have.status(204);
        });
    });
  
    // test strategy:
    //  1. GET shopping list items so we can get ID of one
    //  to delete.
    //  2. DELETE an item and ensure we get back a status 204
    it("should delete items on DELETE", function() {
      return (
        chai
          .request(app)
          // first have to get so we have an `id` of item
          // to delete
          .get("/recipes")
          .then(function(res) {
            return chai.request(app).delete(`/recipes/${res.body[0].id}`);
          })
          .then(function(res) {
            expect(res).to.have.status(204);
          })
      );
    });
  });
  