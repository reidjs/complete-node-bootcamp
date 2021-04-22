// const fs = require('fs');
const Tour = require('../models/tourModel')
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next()
}

class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(field => {
      delete queryObj[field]
    })
    
    // { difficulty: 'easy', rating: { $gte: 5 }}
    let queryStr = JSON.stringify(queryObj)
    // gte, lte, lt, gt
    // TODO: what if the name of a place was lt or gte? 
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    this.query.find(JSON.parse(queryStr))
    return this
    // let query = Tour.find(JSON.parse(queryStr))
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.query.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      const createdAtDescending = '-createdAt'
      this.query = this.query.sort(createdAtDescending)
    }
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsToShow = this.query.fields.split(',').join(' ')
      this.query = this.query.select(fieldsToShow)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = +this.query.page || 1
    const limit = +this.query.limit || 10
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }  
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
    const tours = await features.query

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // console.log('tour', tour)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }

};

exports.createTour = async (req, res) => {
  try {

    const tour = req.body
    const newTour = await Tour.create(tour)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};
