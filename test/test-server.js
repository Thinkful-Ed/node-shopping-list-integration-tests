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
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('id', 'name', 'checked');
        });
        done();
      })
  });
  it('should add an item on POST', function() {
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
  });
  it('should edit an item on PUT');
  it('should delete an item on DELETE');
});