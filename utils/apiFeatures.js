class APIFeatures {
  constructor(queryResult, queryStr) {
    this.queryResult = queryResult;
    this.queryStr = queryStr;
  }

  filter() {
    // localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1000
    // filtering
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // advanced filtering
    /*
      { duration: { gte: '5' }, difficulty: 'easy' }
       { duration: { $gte: '5' }, difficulty: 'easy' }
    */
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.queryResult.find(JSON.parse(queryStr));
    //let result = Tour.find(JSON.parse(queryStr)); // find() with no aprameters return the whole colllection
    return this;
  }

  sort() {
    // SORTING
    if (this.queryStr.sort) {
      // localhost:3000/api/v1/tours?sort=price,-ratingAverage
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.queryResult = this.queryResult.sort(sortBy);
      // queryResult.sort('price -ratingAverage');
    } else {
      // default sort by createdAt
      this.queryResult = this.queryResult.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // LIMITING FIELDS
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.queryResult = this.queryResult.select(fields);
    } else {
      this.queryResult = this.queryResult.select('-__v');
    }
    return this;
  }

  paginate() {
    // PAGINATION
    //localhost:3000/api/v1/tours?page=2&limit=5
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 5;
    const skip = (page - 1) * limit;
    this.queryResult = this.queryResult.skip(skip).limit(limit);

    // if (this.queryStr.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exist');
    //   }
    // }
    return this;
  }
}
module.exports = APIFeatures;
