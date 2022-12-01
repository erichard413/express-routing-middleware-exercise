process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
let items = require("../db/fakeDb");

let item = {"name": "milk", "price": 1.99}

beforeEach(function(){
    items.push(item);
});
  
afterEach(function() {
    items.length = 0;
});

describe("GET /items", ()=>{
    test("Get all items", async ()=> {
      const res = await request(app).get("/items")
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(items)
    })
})

describe("GET /items/:name", ()=>{
    test("Get single item", async ()=> {
        const res = await request(app).get("/items/milk")
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(item)
    })
    test("Get single item - invalid name", async()=>{
        const res = await request(app).get("/items/blahblah")
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", ()=>{
    test("Create new item", async ()=> {
        const res = await request(app).post("/items").send({"name":"pasta","price":0.99});
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({"added": {"name": "pasta", "price": 0.99}})
    })
    test("Create new with missing name - error", async()=>{
        const res = await request(app).post("/items").send({"eggs": 1.00});
        expect(res.statusCode).toBe(400)
    })
    test("Create new with missing price - error", async()=>{
        const res = await request(app).post("/items").send({"name": "pizza"});
        expect(res.statusCode).toBe(400)
    })
})

describe("PATCH /items/name", ()=>{
    test("Update item", async ()=> {
        const res = await request(app).patch("/items/milk").send({"name":"soymilk","price":2.99});
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({"updated": {"name": "soymilk", "price": 2.99}})
    })
})

describe("DELETE /items/name", ()=>{
    test("Delete item", async ()=> {
        const res = await request(app).delete(`/items/${item.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ "message" : "Deleted" })
    })
    test("Delete item that does not exist", async ()=> {
        const res = await request(app).delete(`/items/blahblah`)
        expect(res.statusCode).toBe(404)
    })
})
