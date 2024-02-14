import Cards from "@/model/Cards";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      // Check if the request body contains the 'cardid' field
      if (!req.body.cardid) {
        return res.status(400).json({ success: false, msg: "Missing 'cardid' in the request body." });
      }
  
      const cardid = req.body.cardid;
  
      // Find the card in the database based on the provided cardid
      const foundCard = await Cards.findOne({ cardID: cardid });
  
      if (!foundCard) {
        return res.status(404).json({ success: false, msg: "Card not found." });
      }
  
      // Return the details of the found card as a JSON response
      return res.status(200).json({ success: true, card: foundCard });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
    }
  } else if (req.method === "GET") {
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
