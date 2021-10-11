export const errorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    // console.log(err);
    res.status(404).send(err.message);
  } else if (err.status === 400) {
    res.status(400).send(err.errorList);
  } else {
    console.log("from errorHandler: ", err);
    res.status(500).send("generic server error!");
  }
};
