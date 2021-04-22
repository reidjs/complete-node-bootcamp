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
test('Get tours/:id should return a single tour', async () => {
  Tour.findById.mockResolvedValue({
    data: {
      '1': 'foo'
    }
  })
  const req = { params: { id: '1' }}
  const res = new Response(200)
  await tourController.getTour(req, res)
  expect(res.data.tour.data[1]).toBe('foo')
})

test('Get tours/?page=1&limit=5 returns first five results', async () => {
  const data = {
    '1': '1foo',
    '2': '2foo',
    '3': '3foo',
    '4': '4foo',
    '5': '5foo',
    '6': '6foo',
    '7': '7foo',
  }
  Tour.find.mockResolvedValue({ data })
  Tour.countDocuments.mockResolvedValue(10)
  const req = { query: { page: 1, limit: 5 }}
  const res = new Response(200)
  await tourController.getAllTours(req, res)
  console.log('res', res)
  expect(res.data.tour.data.length).toBe(5)
})