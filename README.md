https://www.udemy.com/course/nodejs-express-mongodb-bootcamp 
# Mongo Overview
Flexible, Scalable Document Database.

Collections (like tables)
  - reviews
  - users
  - etc
Documents Each collection, contains one or more data structures (like rows)
  - one user
  - one blog post
  - Looks like JSON
  - Field-Value pairs 

## BSON
Data format for mongodb. Looks same as JSON, but typed. String, double, int, etc.
{
  "_id": ObjectID('123324234'),
  "title": "foobar",
  "tags": ["bar", "foo"],
  comments: [
    {"foo": "bar"}
  ]
}

Key value pairs are called "fields"

## Embedded documents
denormalized data (see 'comments' field above)

Max size for each document is 16MB

Each document contains unique ID which acts as primary key (auto generated)

## Installation
```
Make sure mongo exists in:
/usr/local/bin
Then make a folder:
/data/db
then give permissions:
sudo chown -R `id -un` /data/db
```
## Atlas
mongodb running in cloud

## Shell
`cmd+K` clear terminal

`use natours-test`
- create database and switch to it

`db.tours.insertOne({ name: "The Forest Hiker", price: 297, rating: 4.7 })`
- insert an object into tours collection

`db.tours.insertMany([{ name: "The Sea Explorer", price: 497, rating: 4.8 }, { name: "The Snow Adventure" , price: 997, rating: 4.9, difficulty: "easy" }])`
- insert many objects

`db.tours.find()`
{ "_id" : ObjectId("6077122006e124d1cd73a308"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }

`show dbs`
- show databases
- use `use` to switch

## Querying
`db.collectionname.find()`
- return all documents in collection

`db.tours.find({ name: "The Forest Hiker" })`
- return document with that name

`db.tours.find({ price: { $lte: 500 } })`
- return documents with price less than or equal to 500

`db.tours.find({ price: { $lte: 500 }, rating: { $gte: 4.8 } })`
- return docs with price lte 500, rating gte 4.8

`db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$gte: 4.8}}]})`
- docs with price lt 500 OR rating gte 4.8

`db.tours.find({ price: {$gt: 500}, rating: {$gte: 4.8} })`
- docs with price gt 500 AND rating gte 4.8

`db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$gte: 4.8}}]}, { name: 1 })`
- only return the 'name' (and objectID) in the output

## Updating Documents
`db.tours.updateOne({ name: "The Snow Adventure" }, { $set: { price: 597, rating: 4.85 } })`
- first object: query which objects you want to update
- second object: fields to update
- you can also add new fields in the second object

`db.tours.replaceOne(...)`
- replace doc

## Deleting Documents
`db.tours.deleteOne({...})`
- deletes first doc matching query

`db.tours.deleteMany({...})`
- deletes all docs matching query

`db.tours.deleteMany({})`
- deletes ALL documents in tours collection


## connecting
mongodb://localhost:27017

# mongoose
mongoose gives us schemas to model data and relationships, easy data validation, query api, middleware

# Declaring schema: 

```js
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: Number,
  price: Number
})
```

Example with defaults and error messages
```js
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"]
  },
  rating: {
    type: Number,
    default: 4.5,
    select: false
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"]
  }
})
```
  - `select: false` sets mongoose to not return this field by default
Defining models: 
```js
const Tour = mongoose.Model('Tour', tourSchema)
```

## MVC Architecture
controllers are application logic

models are business logic

views are presentation logic
  - views are not generally part of the backend api

request -> routers (/tours, /users, etc) -> handler fn (controller) -> models (eg retrieve from DB, or create new one) -> response 

### application logic vs business logic
### application logic
only concerned with app implementation
 - managing requests and responses
 - technical stuff
 - bridge between model and view layer

### business logic
only concerned with business needs/rules
 - checking tours in db
 - creating new tours
 - tour schema
 - validating only users who bought a tour can see it

Fat models, thin controllers. 

Offload as much logic into the models as possible. 

Controller should mostly just be concerned with request/response. 


## Schema
If you try to add fields that are not present in the mongoose schema, they will get ignored

## Dates on Models
```js
  createdAt: {
    type: Date,
    default: Date.now()
  },
```
## Arrays of values on Models
```js
  startDates: [Date]
  names: [String]
```
## Sorting
```js
query.sort('foo bar -baz')
```
  - sorts first by foo asc, then bar asc, then baz descending

## Field Limiting
- also known as "Projecting"

```js
query.select('name duration price')
```
- only returns field names *name* *duration* *price*

```js
query.select('-name -price')
```
- returns everything EXCEPT *name* and *price*

## Pagination
```js
query.skip(20).limit(10)
```
- Skip 20 records and show 10 (21-30 inclusive)
- Formula: skip = (page - 1) * limit

### countDocuments
```js
await model.countDocuments()
```
