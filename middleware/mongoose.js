const mongoose = require("mongoose");

const connectDb = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }
  await mongoose.connect("mongodb+srv://zbytes1:OMrHtXsW9EdP5xSf@cluster0.45jhcsq.mongodb.net/sd1?retryWrites=true&w=majority");
  return handler(req, res);
};
export default connectDb;