const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const { app, runServer, closeServer } = require("../server");

describe("Recipes", function() {
    before(function() {
        return runServer();
    });
    after(function(){
        return closeServer();
    });

    it("should list items on Get", function(){
        return chai 
            .request(app)
            .get("/recipes")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ["name", "id", "ingredients"];

                res.body.forEach(function(item){
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys)
                });
        });
    });

    it('should add an item on POST', function(){
        const newItem = {name: 'rice', ingredients: ['water', 'soup','rice']}
        return chai 
            .request(app)
            .post("/recipes")
            .send(newItem)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id", "name", "ingredients");
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.not.equal(null);
                expect(res.body).to.deep.equal(
                    Object.assign(newItem, {id: res.body.id})
                )
            })
    })

    it("should update items on PUT", function(){
        const updateData = {
            name:"pad thai",
            ingredients: ['noodles', 'water', 'rice']
        }

        return (
            chai
                .request(app)
                .get("/recipes")
                .then(function(res){
                    updateData.id = res.body[0].id;
                    return chai 
                        .request(app)
                        .put(`/recipes/${updateData.id}`).send(updateData)
                })
                .then(function(res){
                    expect(res).to.have.status(204);
                })
            )
        })
    it("should delete items on Delete", function(){
        return (
            chai
                .request(app)
                .get("/recipes")
                .then(function(res){
                    return chai.request(app).delete(`/shopping-list/${res.body[0].id}`)
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                })
        );
    });
});

