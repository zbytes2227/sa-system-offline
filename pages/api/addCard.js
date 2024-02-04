
import Cards from "@/model/Cards";
import connectDb from "../../middleware/mongoose";


const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      console.log(req.body);
      const newCard = new Cards({
        cardID: req.body.cardID,
        name: req.body.name,
        class: req.body.class,
        contact: req.body.contact,
      });

      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "New Card Added Successfuly.." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error..Contact the Developers." });
    }
  }
};

export default connectDb(handler);