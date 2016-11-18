const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const {ShoppingList} = require('../models');

const should = chai.should();

chai.use(chaiHttp);

describe('Shopping List', function() {
  it('should list items on GET', function(done) {
    chai.request(app)
      .get('/shopping-list')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      })
  });
  it('should add an item on POST');
  it('should edit an item on PUT');
  it('should delete an item on DELETE');
});