// const fs = require('fs');
const Tour = require('../models/tourModel')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    // const tours = await Tour.find().where('duration').lte(5).where('difficulty').equals('easy')
    // shallow copy
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(field => {
      delete queryObj[field]
    })
    
    // { difficulty: 'easy', rating: { $gte: 5 }}
    let queryStr = JSON.stringify(queryObj)
    // gte, lte, lt, gt
    // TODO: what if the name of a place was lt or gte? 
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    let query = Tour.find(JSON.parse(queryStr))

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      const createdAtDescending = '-createdAt'
      query = query.sort(createdAtDescending)
    }

    // Field limiting
    if (req.query.fields) {
      const fieldsToShow = req.query.fields.split(',').join(' ')
      query = query.select(fieldsToShow)
    } else {
      query = query.select('-__v')
    }

    // Pagination
    if (req.query.page || req.query.limit) {
      const page = +req.query.page || 1
      const limit = +req.query.limit || 10
      const skip = (page - 1) * limit
      const numberOfTours = await Tour.countDocuments()
      if (skip >= numberOfTours) {
        throw new Error('This page does not exist')
      }
      query = query.skip(skip).limit(limit)
    } else {
      query = query.limit(10)
    }


    const tours = await query

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
    console.log('tour', tour)
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
