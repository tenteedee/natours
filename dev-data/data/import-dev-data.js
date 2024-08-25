const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../model/tourModel');

dotenv.config({
  path: '../../config.env',
});

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

// connect to the database
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to MongoDB'));

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// import data onto db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);

// If adding a new filed to the schema, example: location
// const updateTours = async () => {
//   try {
//     await Tour.updateMany({}, { $set: { location: 'Unknown' } });
//     console.log('All documents updated successfully!');
//   } catch (error) {
//     console.log('Error updating documents:', error);
//   }
//   process.exit();
// };

// updateTours();
