import Post from "../Model/Post.js";
import UserCustomPrice from "../Model/UserCustomeprice.js";

// CREATE MATCH
export const createPost = async (req, res) => {
  try {
    const {
      event,
      title,
      price,
      date,
      time,
      place,
    } = req.body;

    // VALIDATION

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title required",
      });
    }

    if (!price) {
      return res.status(400).json({
        success: false,
        message: "Price required",
      });
    }

    // CREATE

    const post = await Post.create({
      event,
      title,
      price, // ✅ FIXED
      date,
      time,
      place,
    });

    res.status(201).json({
      success: true,
      message:
        "Match created successfully 🏏",
      post,
    });
  } catch (error) {
    console.log("CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL MATCHES
export const getAllPosts = async (
  req,
  res
) => {
  try {
    const userId = req.headers.userid;

    const posts = await Post.find()
      .populate({
        path: "event",
        populate: {
          path: "parentEvent",
        },
      })
      .sort({ createdAt: -1 });

    let userPrices = [];

    if (userId) {
      userPrices =
        await UserCustomPrice.find({
          userId,
        });
    }

    // MERGE USER PRICE

    const finalPosts = posts.map(
      (post) => {
        const match =
          userPrices.find(
            (u) =>
              String(u.postId) ===
              String(post._id)
          );

        return {
          ...post._doc,
          userPrice:
            match?.customPrice || null,
        };
      }
    );

    res.json({
      success: true,
      posts: finalPosts,
    });
  } catch (error) {
    console.log("GET ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Fetch Failed",
    });
  }
};

// USER SET PRICE
export const setUserPrice = async (
  req,
  res
) => {
  try {
    const { postId, price } =
      req.body;

    const userId =
      req.headers.userid;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId required",
      });
    }

    if (!price || price < 100) {
      return res.status(400).json({
        success: false,
        message: "Price too low ❌",
      });
    }

    let record =
      await UserCustomPrice.findOne({
        userId,
        postId,
      });

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
      message:
        "User price updated ✅",
    });
  } catch (error) {
    console.log(
      "USER PRICE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE MATCH
export const updatePost = async (
  req,
  res
) => {
  try {
    const {
      event,
      title,
      price,
      date,
      time,
      place,
    } = req.body;

    const post =
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          event,
          title,
          price, // ✅ FIXED
          date,
          time,
          place,
        },
        { new: true }
      );

    res.json({
      success: true,
      message:
        "Updated successfully ✅",
      post,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE MATCH
export const deletePost = async (
  req,
  res
) => {
  try {
    await Post.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Deleted successfully 🗑️",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};