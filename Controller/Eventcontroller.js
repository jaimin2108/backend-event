import Event from "../Model/Eventmodel.js";

// ================= CREATE EVENT =================
export const createEvent = async (req, res) => {
  try {

    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const title = req.body.title;
    const parentEvent = req.body.parentEvent || null;

    // ✅ Check title
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // ✅ Image filename
    let image = "";

    if (req.file) {
      image = req.file.filename;
    }

    // ✅ Save event
    const event = await Event.create({
      title,
      parentEvent,
      image,
    });

    console.log("EVENT CREATED:", event);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });

  } catch (error) {

    console.log("CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL EVENTS =================
export const getAllEvents = async (req, res) => {
  try {

    const events = await Event.find()
      .populate("parentEvent")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE EVENT =================
export const deleteEvent = async (req, res) => {
  try {

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= PARENT EVENTS =================
export const getParentEvents = async (req, res) => {
  try {

    const events = await Event.find({
      parentEvent: null,
    });

    res.status(200).json({
      success: true,
      events,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CHILD EVENTS =================
export const getChildEvents = async (req, res) => {
  try {

    const events = await Event.find({
      parentEvent: req.params.parentId,
    });

    res.status(200).json({
      success: true,
      events,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= TOGGLE ACTIVE =================
export const toggleActiveEvent = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    event.isActive = !event.isActive;

    await event.save();

    res.status(200).json({
      success: true,
      event,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= TOGGLE STATUS =================
export const toggleEventStatus = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    event.status =
      event.status === "Open"
        ? "Closed"
        : "Open";

    await event.save();

    res.status(200).json({
      success: true,
      event,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};