import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useUser } from "../../hooks/useUser";
import { useGetSingleTeacher } from "../../services/queries/teachers";
// Import useClasses to fetch all classes
import { useClasses } from "../../services/queries/classes";
import { darkTheme } from "../../theme/darkTheme";

// Type definitions
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Define a more complete Class type based on ClassesTable.tsx
interface Class {
  id: number;
  name: string;
  description?: string;
  maxStudents?: number;
  periodLength?: number;
  periodsPerDay?: number;
  workingDays?: string[];
  // Add other relevant class properties if needed
}

interface SubjectTeachers {
  [key: string]: number; // Assuming key is subjectId (string) and value is teacherId (number)
}

interface Section {
  id: number;
  name: string;
  classTeacherId: number;
  subjectTeachers: SubjectTeachers;
  classId: number;
  createdAt: string;
  updatedAt: string;
  sectionId: null | number;
  examId: null | number;
  class?: Class; // Class data will be added here after processing
}

// TabPanel component (remains the same)
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TeacherClass: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { data: userData, isLoading: isUserLoading } = useUser();

  // Fetch the specific teacher's data (including their sections)
  const {
    data: teacherData,
    isLoading: isTeacherLoading,
    error: teacherError,
  } = useGetSingleTeacher(userData!.data?.user?.id); // Use optional chaining

  // --- Fetch ALL classes at the top level ---
  const { data: allClassesData, isLoading: isLoadingClasses } = useClasses();
  console.log({ allClassesData });
  // --- Process sections and merge with class data using useMemo ---
  const sectionsWithClasses = useMemo(() => {
    // Wait until both teacher sections and all classes data are loaded
    if (!teacherData?.data?.sections || !allClassesData) {
      // console.log("Waiting for data:", { hasTeacherSections: !!teacherData?.data?.sections, hasAllClasses: !!allClassesData });
      return [];
    }

    // Create a Map for efficient class lookup (ID -> Class Object)
    const classMap = new Map<number, Class>();
    allClassesData.forEach((cls) => classMap.set(cls.id, cls));
    // console.log("Class Map created:", classMap);

    // Map teacher's sections and add the corresponding class data
    const processedSections = teacherData.data.sections.map(
      (section: Section) => {
        const classInfo = classMap.get(section.classId);
        // console.log(`Processing Section ${section.name} (Class ID: ${section.classId}), Found Class:`, classInfo);
        return {
          ...section,
          // Add the found class data, or a fallback if not found
          class: classInfo || {
            id: section.classId,
            name: `Class ${section.classId} (Details Unavailable)`, // Indicate if lookup failed
          },
        };
      }
    );
    // console.log("Processed Sections with Classes:", processedSections);
    return processedSections;

    // Add both teacherData and allClassesData as dependencies
  }, [teacherData, allClassesData]);

  // --- Extract unique classes from the *processed* sections data ---
  const uniqueClasses = useMemo(() => {
    // Depend on the processed sectionsWithClasses
    if (!sectionsWithClasses.length) return [];

    const classMap = new Map<number, Class>();
    sectionsWithClasses.forEach((section) => {
      // Ensure section.class exists and has an id before adding
      if (section.class && section.class.id != null) {
        classMap.set(section.class.id, section.class);
      }
    });
    // console.log("Unique Classes derived:", Array.from(classMap.values()));
    return Array.from(classMap.values());
  }, [sectionsWithClasses]);

  // --- Group sections by class using the *processed* data ---
  const sectionsByClass = useMemo(() => {
    // Depend on the processed sectionsWithClasses
    if (!sectionsWithClasses.length) return new Map<number, Section[]>();

    const groupedSections = new Map<number, Section[]>();

    sectionsWithClasses.forEach((section) => {
      // Ensure section.class exists before grouping
      if (section.class && section.class.id != null) {
        const classId = section.class.id;
        if (!groupedSections.has(classId)) {
          groupedSections.set(classId, []);
        }
        // Use non-null assertion as we've checked .has()
        groupedSections.get(classId)!.push(section);
      }
    });
    // console.log("Sections Grouped by Class:", groupedSections);
    return groupedSections;
  }, [sectionsWithClasses]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // --- Helper functions to check teacher roles ---
  const isClassTeacher = (section: Section): boolean => {
    // Use optional chaining for safety
    return section.classTeacherId === teacherData?.data?.id;
  };

  const isSubjectTeacher = (section: Section): boolean => {
    const teacherId = teacherData?.data?.id;
    if (teacherId === undefined || !section.subjectTeachers) return false; // Guard clause
    // Check if the teacher's ID exists as a value in the subjectTeachers map
    return Object.values(section.subjectTeachers).includes(teacherId);
  };

  // Get subject IDs for which the logged-in teacher teaches in a specific section
  const getTeacherSubjectIds = (section: Section): string[] => {
    const subjects: string[] = [];
    const teacherId = teacherData?.data?.id;

    // Guard clauses
    if (teacherId === undefined || !section.subjectTeachers) {
      return [];
    }

    Object.entries(section.subjectTeachers).forEach(([subjectId, id]) => {
      if (id === teacherId) {
        subjects.push(subjectId); // subjectId is the key (string)
      }
    });
    return subjects;
  };

  // --- Combined Loading State ---
  // Include loading state for all relevant hooks
  const isLoading = isUserLoading || isTeacherLoading || isLoadingClasses;

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            width: "100%",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2, color: "text.secondary" }}>
            Loading class information...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // --- Render Error State ---
  // Check for teacher data error specifically
  if (teacherError) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.default",
            p: 3,
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load your teaching data: {teacherError.message}
          </Alert>
          <Typography variant="body1" color="text.secondary">
            Please try refreshing the page or contact support if the problem
            persists.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // --- Render Empty State (No Sections Assigned) ---
  // Check after loading and error states, using the final processed data source
  if (!sectionsWithClasses || sectionsWithClasses.length === 0) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.default",
            color: "text.primary",
            p: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            My Classes
          </Typography>
          <Paper
            sx={{
              width: "100%",
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              textAlign: "center",
              mt: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              You are not currently assigned to any sections.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              If you believe this is an error, please contact the school
              administration.
            </Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  // --- Render Section Card ---
  const renderSectionCard = (section: Section, showSubjectChips = true) => (
    <ListItem
      key={section.id}
      sx={{
        flexDirection: "column",
        alignItems: "flex-start",
        bgcolor: "rgba(255, 255, 255, 0.05)", // Slightly lighter background for contrast
        borderRadius: 1,
        mb: 1,
        p: 2,
      }}
    >
      <ListItemText
        primary={
          <Typography variant="body1" fontWeight="medium">
            Section {section.name}
          </Typography>
        }
        secondary={
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {/* Show Class Teacher chip only if applicable and chips are enabled */}
            {isClassTeacher(section) && showSubjectChips && (
              <Chip
                label="Class Teacher"
                color="primary"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            )}
            {/* Show Subject Teacher chips only if applicable and chips are enabled */}
            {isSubjectTeacher(section) &&
              showSubjectChips &&
              getTeacherSubjectIds(section).map((subjectId) => (
                <Chip
                  key={subjectId}
                  // TODO: Ideally, fetch subject names based on IDs if available
                  label={`Subject ${subjectId}`}
                  color="secondary"
                  variant="outlined" // Use outlined for subjects to differentiate
                  size="small"
                />
              ))}
          </Box>
        }
      />
    </ListItem>
  );

  // --- Render Class Card ---
  const renderClassCard = (
    classItem: Class,
    sections: Section[],
    title: string,
    showSubjectChips = true // Control chip visibility per card type
  ) => (
    <Grid item xs={12} md={6} lg={4} key={classItem.id}>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          bgcolor: "background.paper",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex", // Ensure consistent height
          flexDirection: "column", // Stack content vertically
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {" "}
          {/* Allow content to grow */}
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            color="primary.light"
          >
            {/* Use the actual class name fetched */}
            Class {classItem.name}
          </Typography>
          <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
          <Typography
            variant="subtitle1" // Slightly smaller heading for sections
            component="h3"
            gutterBottom
            color="text.secondary"
            sx={{ mb: 1.5 }} // Add some margin below title
          >
            {title}
          </Typography>
          {sections.length > 0 ? (
            <List disablePadding>
              {" "}
              {/* Remove default padding */}
              {sections.map((section) =>
                renderSectionCard(section, showSubjectChips)
              )}
            </List>
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ mt: 2 }}>
              No sections found for this category.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  // --- Main Render ---
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.default",
          color: "text.primary",
          p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 3 }} // Add margin below title
        >
          My Classes & Sections
        </Typography>

        <Paper
          elevation={3} // Add subtle elevation
          sx={{
            width: "100%",
            mb: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            overflow: "hidden", // Ensure tabs fit nicely
            // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)", // Keep shadow if desired
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable" // Good for potentially many tabs or smaller screens
            scrollButtons="auto"
            aria-label="Teacher class sections tabs"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label="All My Sections"
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              label="As Class Teacher"
              id="tab-1"
              aria-controls="tabpanel-1"
            />
            <Tab
              label="As Subject Teacher"
              id="tab-2"
              aria-controls="tabpanel-2"
            />
          </Tabs>

          {/* --- All Classes Tab --- */}
          <TabPanel value={tabValue} index={0}>
            {uniqueClasses.length > 0 ? (
              <Grid container spacing={3}>
                {uniqueClasses.map((classItem) => {
                  // Get all sections for this class from the grouped map
                  const sectionsForThisClass =
                    sectionsByClass.get(classItem.id) || [];
                  // Only render the card if there are sections for this class
                  if (sectionsForThisClass.length > 0) {
                    return renderClassCard(
                      classItem,
                      sectionsForThisClass,
                      "My Sections in this Class",
                      true // Show all chips in the "All" tab
                    );
                  }
                  return null; // Don't render a card if the teacher has no sections in this class
                })}
              </Grid>
            ) : (
              // This case should technically be covered by the main empty state,
              // but added for robustness within the tab.
              <Typography sx={{ textAlign: "center", p: 3 }}>
                No classes found based on your assigned sections.
              </Typography>
            )}
          </TabPanel>

          {/* --- Class Teacher Tab --- */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {
                uniqueClasses
                  .map((classItem) => {
                    // Filter sections where the teacher is the Class Teacher
                    const classTeacherSections = (
                      sectionsByClass.get(classItem.id) || []
                    ).filter(isClassTeacher);

                    // Return null if no sections match for this class
                    if (classTeacherSections.length === 0) return null;

                    // Render the card for this class with only the relevant sections
                    return renderClassCard(
                      classItem,
                      classTeacherSections,
                      "Sections where you are Class Teacher",
                      false // Typically don't need subject chips when viewing by Class Teacher role
                    );
                  })
                  .filter(Boolean) /* Remove null entries */
              }
            </Grid>
            {/* Add empty state specifically for this tab */}
            {uniqueClasses.every(
              (classItem) =>
                !(sectionsByClass.get(classItem.id) || []).some(isClassTeacher)
            ) && (
              <Typography sx={{ textAlign: "center", p: 3 }}>
                You are not assigned as a Class Teacher for any section.
              </Typography>
            )}
          </TabPanel>

          {/* --- Subject Teacher Tab --- */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {
                uniqueClasses
                  .map((classItem) => {
                    // Filter sections where the teacher is a Subject Teacher
                    const subjectTeacherSections = (
                      sectionsByClass.get(classItem.id) || []
                    ).filter(isSubjectTeacher);

                    // Return null if no sections match for this class
                    if (subjectTeacherSections.length === 0) return null;

                    // Render the card for this class with only the relevant sections
                    return renderClassCard(
                      classItem,
                      subjectTeacherSections,
                      "Sections where you are Subject Teacher",
                      true // Show subject chips here to indicate which subjects
                    );
                  })
                  .filter(Boolean) /* Remove null entries */
              }
            </Grid>
            {/* Add empty state specifically for this tab */}
            {uniqueClasses.every(
              (classItem) =>
                !(sectionsByClass.get(classItem.id) || []).some(
                  isSubjectTeacher
                )
            ) && (
              <Typography sx={{ textAlign: "center", p: 3 }}>
                You are not assigned as a Subject Teacher for any section.
              </Typography>
            )}
          </TabPanel>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default TeacherClass;
