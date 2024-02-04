import Cards from "@/model/Cards";
import connectDb from "../../middleware/mongoose";
import Attendance from "@/model/Attendance";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { ids } = req.body; // Assuming that the array of ids is sent in the request body

      // Fetch details from the Cards model for the given ids
      const cardsDetails = await Cards.find({ cardID: { $in: ids } });

      // Create an array to store details of each attendance record
      console.log(cardsDetails);
      res
        .status(200)
        .json({
          success: true,
          msg: "All Requested Student Details",
          details: cardsDetails,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, msg: "Server error...." });
    }
  }
};
export default connectDb(handler);
