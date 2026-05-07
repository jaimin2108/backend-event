import Gallery from "../Model/Gallery.js";

// Upload
export const uploadGallery = async (req, res) => {
  try {
    const { name } = req.body;

    const newGallery = new Gallery({
      name,
      image: req.file.filename,
    });

    await newGallery.save();

    res.json({ success: true, data: newGallery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all
export const getGallery = async (req, res) => {
  try {
    const data = await Gallery.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};