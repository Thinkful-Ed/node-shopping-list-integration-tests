const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

let server;

beforeEach(function() {
  server = require('../server');
});

afterEach(function() {
  server.close();
})

describe('Shopping List', function() {

  it('should list items on GET', function(done) {
    chai.request(server)
      .get('/shopping-list')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        // because we create three items on app load
        res.body.should.have.length(3);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('id', 'name', 'checked');
        });
        done();
      })
  });
  it('should add an item on POST', function(done) {
    const newItem = {name: 'coffee', checked: false};
    chai.request(server)
      .post(newItem)
      .end(function(err, res) {
        res.should.have.status(204);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'checked');
        res.body.name.should.be(newItem.name);
        res.body.checked.should.be(newItem.checked);
      });
      done();
  });
  it('should update items on PUT', function(done) {
    chai.request(server)
      // first have to get
      .get('/shopping-list')
      .end(function(err, res) {
        chai.request(server)
        // send it
          .put(`/shopping-list/${res.body[0].id}`)
          .send({budget: 4, name: 'foo', checked: true, id: res.body[0].id})
          .end(function(err, res) {
            res.should.have.status(204);
            // res.should.be.json;
          });
      })
      done();
  });
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
      })
      done();
  });
});