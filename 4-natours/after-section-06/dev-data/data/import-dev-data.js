const fs = require('fs')
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel')
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
mongoose.connect(process.env.DATABASE_LOCAL, 
{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('db connect success!')
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('data successfully loaded')
  } catch(err) {
    console.log('err', err)
  }
  process.exit()
}

const deleteData = async () => {
  try {
    await Tour.deleteMany({})
    console.log('Deleted all documents')
  } catch(err) {
    console.log('err', err)
  }
  process.exit()
}
// then import
console.log('process.argv', process.argv)

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}