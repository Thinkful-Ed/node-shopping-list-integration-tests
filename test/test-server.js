const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const {ShoppingList} = require('../models');

chai.use(chaiHttp);

describe('Shopping List', function() {
  it('should list items on GET');
  it('should add an item on POST');
  it('should edit an item on PUT');
  it('should delete an item on DELETE');
});