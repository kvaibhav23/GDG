const pool = require("../db/db");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM myschema.courses");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Add a new course
const addCourse = async (req, res) => {
  const { name, code, description, credit, image } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO myschema.courses (name, code, description, credit, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, code, description, credit, image]
    );
    res.status(201).json(result.rows[0]);
    console.log("Course added:", result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to add course" });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, code, description, credit, image } = req.body;
  try {
    const result = await pool.query(
      "UPDATE myschema.courses SET name = $1, code = $2, description = $3, credit = $4, image = $5 WHERE id = $6 RETURNING *",
      [name, code, description, credit, image, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(result.rows[0]);
    console.log("Course updated:", result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM myschema.courses WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
    console.log("Course deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

module.exports = {
  getAllCourses,
  addCourse: [authenticateToken, addCourse],
  updateCourse: [authenticateToken, updateCourse],
  deleteCourse: [authenticateToken, deleteCourse],
};
