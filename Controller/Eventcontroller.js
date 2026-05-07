import Event from "../Model/Eventmodel.js";

// ================= CREATE EVENT =================
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      parentEvent,
      realPrice,
      profit,
      date,
      time,
      place
    } = req.body;

    const event = await Event.create({
      title,
      parentEvent: parentEvent || null,
      realPrice: realPrice || 0,
      profit: profit || 0,
      date: date || null,
      time: time || null,
      place: place || "",
      image: req.file ? req.file.filename : "",
    });

    res.status(201).json({
      success: true,
      message: parentEvent
        ? "Match created under IPL ✅"
        : "IPL created successfully ✅",
      event,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create failed ❌",
      error: error.message,
    });
  }
};

// ================= GET ALL =================
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("parentEvent");

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PARENT (IPL) =================
export const getParentEvents = async (req, res) => {
  try {
    const events = await Event.find({ parentEvent: null });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET CHILD (MATCHES) =================
export const getChildEvents = async (req, res) => {
  try {
    const { parentId } = req.params;

    const events = await Event.find({ parentEvent: parentId });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.deleteMany({ parentEvent: id });

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found ❌" });
    }

    res.json({
      success: true,
      message: "Deleted successfully 🗑️",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= TOGGLE ACTIVE =================
export const toggleActiveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Not found ❌" });
    }

    event.isActive = !event.isActive;
    await event.save();

    res.json({
      success: true,
      message: event.isActive ? "Activated ✅" : "Deactivated ❌",
      event,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= OPEN / CLOSE =================
export const toggleEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Not found ❌" });
    }

    event.status = event.status === "Open" ? "Closed" : "Open";
    await event.save();

    res.json({
      success: true,
      message: event.status,
      event,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};