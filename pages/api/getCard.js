import Cards from "@/model/Cards";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Find all cards in the database
      const allCards = await Cards.find({});

      // Return the found cards as a JSON response
      return res.status(200).json({ success: true, cards: allCards });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
    }
  }
};

export default connectDb(handler);
