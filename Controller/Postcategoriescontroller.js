import Post from "../Model/Post.js";
import UserCustomPrice from "../Model/UserCustomeprice.js"; // ✅ ADD THIS

// CREATE MATCH
export const createPost = async (req, res) => {
  try {
    const { event, title, price, realPrice, date, time, place } = req.body;
    const post = await Post.create({
      event,
      title,
      realPrice: realPrice || price,
      date,
      time,
      place,
    });

    res.status(201).json({
      success: true,
      message: "Match created successfully 🏏",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MATCHES + USER PRICE ✅ UPDATED
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.headers.userid; // ✅ ADD THIS

    const posts = await Post.find().populate({
      path: "event",
      populate: {
        path: "parentEvent",
      },
    });

    let userPrices = [];

    if (userId) {
      userPrices = await UserCustomPrice.find({ userId });
    }

    // ✅ MERGE USER PRICE
    const finalPosts = posts.map((post) => {
      const match = userPrices.find(
        (u) => String(u.postId) === String(post._id)
      );

      return {
        ...post._doc,
        userPrice: match?.customPrice, // 👈 ADD THIS
      };
    });

    console.log("POSTS 👉", JSON.stringify(finalPosts, null, 2));

    res.json({
      success: true,
      posts: finalPosts,
    });
  } catch (error) {
    console.log("GET ERROR:", error);
    res.status(500).json({
      message: "Fetch Failed",
    });
  }
};

// ✅ NEW FUNCTION: USER SET PRICE
export const setUserPrice = async (req, res) => {
  try {
    const { postId, price } = req.body;
    const userId = req.headers.userid;

    if (!userId) {
      return res.status(400).json({ message: "UserId required" });
    }

    if (price < 100) {
      return res.status(400).json({ message: "Price too low ❌" });
    }

    let record = await UserCustomPrice.findOne({ userId, postId });

    if (record) {
      record.customPrice = price;
      await record.save();
    } else {
      await UserCustomPrice.create({
        userId,
        postId,
        customPrice: price,
      });
    }

    res.json({
      success: true,
      message: "User price updated ✅",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MATCH
export const updatePost = async (req, res) => {
  try {
    const { event, title, price, realPrice, date, time, place } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { event, title, realPrice: realPrice || price, date, time, place },
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully ✅",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MATCH
export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully 🗑️",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};