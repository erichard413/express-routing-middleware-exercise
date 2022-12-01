const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../db/fakeDb")

router.get("/", function (req, res) {
    res.json(items)
})

router.post("/", function (req, res, next){
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError("Name and price is required", 400);
        const newItem = { name: req.body.name, price: req.body.price }
        items.push(newItem)
        return res.status(201).json({"added": newItem})
      } catch (e) {
        return next(e)
      }
})

router.get("/:name", function (req, res, next){
    try {
        const foundItem = items.find(item => item.name === req.params.name)
        if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404)
        }
        res.json(foundItem)
    } catch (e) {
        next(e)
    }
})

router.patch("/:name", function(req, res, next){
    try {
        const foundItem = items.find(item=> item.name === req.params.name)
        if (foundItem === undefined) {
            throw new ExpressError("Item not found", 404)
        }
        if (req.body.name) {
            foundItem.name = req.body.name;
        }
        if (req.body.price) {
            foundItem.price = req.body.price
        }
        return res.json({"updated": foundItem})
    } catch(e) {
        next(e)
    }
})

router.delete("/:name", function(req, res, next){
    try {
        const foundItem = items.findIndex(item => item.name === req.params.name)
        if (foundItem === -1) {
        throw new ExpressError("Item not found", 404)
        }
        items.splice(foundItem, 1)
        res.json({ message: "Deleted" })
    } catch(e) {
        next(e)
    }
})


module.exports = router;