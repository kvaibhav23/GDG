"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import axios from "axios";
import AppBarComponent from "../components/AppBarComponent";
import CourseCard from "../components/CourseCard";
import AddCourseDialog from "../components/AddCourseDialog";
import ViewCourseDialog from "../components/ViewCourseDialog";

export default function LandingPage() {
  const [courses, setCourses] = useState([
    // Predefined courses from Code 2
    {
      name: "ECONOMY, SOCIETY AND PUBLIC POLICY",
      code: "ECO111",
      credits: 9,
      description: "An Introductory Course on Macroeconomics",
      imageUrl: "frontend/images/images.png",
    },
    {
      name: "DATA STRUCTURES AND ALGORITHMS",
      code: "ESO207",
      credits: 11,
      description: "Learn about arrays, linked lists and more.",
      imageUrl: "frontend/images/channels4_profile.jpg",
    },
    {
      name: "MECHANICS OF SOLIDS",
      code: "ESO202",
      credits: 11,
      description: "Introduction to mechanics of deformable solid bodies.",
      imageUrl: "frontend/images/gears.jpg",
    },
    {
      name: "COMPUTATIONAL METHODS",
      code: "MSE204",
      credits: 9,
      description: "Learn about various Statistical Methods.",
      imageUrl: "frontend/images/1_c_fiB-YgbnMl6nntYGBMHQ.jpg",
    },
  ]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch additional courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4005/courses");
        // Combine hardcoded courses with backend courses
        setCourses((prevCourses) => [...prevCourses, ...response.data]);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to fetch courses. Please try again.");
      }
    };

    fetchCourses();
  }, []);

  const handleAddOpen = () => setOpenAddDialog(true);
  const handleAddClose = () => setOpenAddDialog(false);

  const handleViewCourse = (course) => setSelectedCourse(course);
  const handleCloseViewDialog = () => setSelectedCourse(null);

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
    setSelectedCourse(null);
  };

  const handleUpdateCourse = (id, updatedCourse) => {
    setCourses(courses.map((course) => (course.id === id ? updatedCourse : course)));
    setSelectedCourse(null);
  };

  const handleAddCourseSuccess = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  return (
    <Box>
      <AppBarComponent title="Course Helper" />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CourseCard course={course} onClick={() => handleViewCourse(course)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddOpen}
        sx={{ position: "fixed", bottom: 16, left: 16 }}
      >
        Add Course
      </Button>

      <AddCourseDialog open={openAddDialog} onClose={handleAddClose} onSuccess={handleAddCourseSuccess} />

      {selectedCourse && (
        <ViewCourseDialog
          open={Boolean(selectedCourse)}
          course={selectedCourse}
          onClose={handleCloseViewDialog}
          onUpdate={handleUpdateCourse}
          onDelete={handleDeleteCourse}
        />
      )}
    </Box>
  );
}
