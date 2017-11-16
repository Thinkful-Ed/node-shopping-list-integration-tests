const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes List', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();		
	});

	it('Should list recipes with GET request', function(){
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.at.least(1);

			const expectedParams = ['id', 'name', 'ingredients'];
			res.body.forEach(function(item) {
          	item.should.be.a('object');
          	item.should.include.keys(expectedParams);
			});
		});

	});

	it('Should add a recipe with POST request', function(){
		const testRecipe = {name: "PB&J", ingredients: ['peanut butter', 'jelly', 'bread']};
		return chai.request(app)
		.post('/recipes')
		.send(testRecipe)
		.then(function(res){
			res.should.have.status(201);
		    res.should.be.json;
		    res.body.should.be.a('object');
		    res.body.should.include.keys('id', 'name', 'ingredients');
		    res.body.id.should.not.be.null;
		    res.body.should.deep.equal(Object.assign(testRecipe, {id: res.body.id}));
		});
	});

	it('Should update a recipe with PUT request', function(){
		const updatedRecipe = {
      	name: 'new name',
      	ingredients: ['new ingredient 1', 'new ingredient 2', 'new ingredient 3']
    };

    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updatedRecipe.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updatedRecipe.id}`)
          .send(updatedRecipe);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
	});

	it('Should delete a recipe with DELETE request', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });


});