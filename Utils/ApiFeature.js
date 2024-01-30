class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const excludeFields = ["sort", "page", "limit", "fields"];
    const queryObj = { ...this.queryString };
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });
    console.log(queryObj);
    let queryString = JSON.stringify(queryObj);
    queryString = JSON.parse(
      queryString.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`)
    );

    this.query = this.query.find(queryString);
    // process.exit();

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let queryString = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(queryString);
    }
    return this;
  }
  pagination() {
    if (this.queryString.page && this.queryString.limit) {
      let page = this.queryString.page || 1;
      let limit = this.queryString.limit || 3;
      let skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      let queryString = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(queryString);
    }
    return this;
  }
}
module.exports = ApiFeature;
