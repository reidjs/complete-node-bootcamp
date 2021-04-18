const tourController = require('./tourController');
const Tour = require('../models/tourModel')

jest.mock('../models/tourModel')

class Response {
  constructor() {}
  status(code) {
    this.status = code
    return this
  }
  json(obj) {
    const keys = Object.keys(obj)
    keys.forEach(key => {
      this[key] = obj[key]
    })
  }
}

// Get requests to /:id 
test('Requesting tour by id should return tour', async () => {
  Tour.findById.mockResolvedValue({
    data: {
      '1': 'foo'
    }
  })
  const res = new Response(200)
  await tourController.getTour({ params: { id: '1' }}, res)
  expect(res.data.tour.data[1]).toBe('foo')
})