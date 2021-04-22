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
      const fieldsToShow = this.queryString.fields.split(',').join(' ')
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

module.exports = APIFeatures