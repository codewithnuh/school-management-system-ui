
import React, { useState } from "react";
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
import { darkTheme } from "../../theme/darkTheme";

// Type definitions
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Class {
  id: number;
  name: string;
  maxStudents?: number;
  periodsPerDay?: number;
  periodLength?: number;
  workingDays?: string[];
  subjectIds?: number[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  examId?: number | null;
  classId?: number | null;
}

interface SubjectTeachers {
  [key: string]: number; // subjectId (string) -> teacherId (number)
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
  class?: Class;
}

interface TeacherData {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNo: string;
  role: string;
  sections: Section[];
  // Other fields omitted for brevity
}

// TabPanel component
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
    data: teacherResponse,
    isLoading: isTeacherLoading,
    error: teacherError,
  } = useGetSingleTeacher(userData?.data?.user?.id);

  // Extract the teacher data from the response
  const teacherData: TeacherData | undefined = teacherResponse?.data;

  // --- Helper functions to check teacher roles ---
  const isClassTeacher = (section: Section): boolean => {
    return section.classTeacherId === teacherData?.id;
  };

  const isSubjectTeacher = (section: Section): boolean => {
    const teacherId = teacherData?.id;
    if (teacherId === undefined || !section.subjectTeachers) return false;
    return Object.values(section.subjectTeachers).includes(teacherId);
  };

  // Get subject IDs for which the logged-in teacher teaches in a specific section
  const getTeacherSubjectIds = (section: Section): string[] => {
    const subjects: string[] = [];
    const teacherId = teacherData?.id;

    if (teacherId === undefined || !section.subjectTeachers) {
      return [];
    }

    Object.entries(section.subjectTeachers).forEach(([subjectId, id]) => {
      if (id === teacherId) {
        subjects.push(subjectId);
      }
    });
    return subjects;
  };

  // --- Combined Loading State ---
  const isLoading = isUserLoading || isTeacherLoading;

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
  if (!teacherData?.sections || teacherData.sections.length === 0) {
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

  // Extract unique classes from the sections
  const uniqueClasses = Array.from(
    new Map(
      teacherData.sections
        .filter(section => section.class) // Filter out sections without class data
        .map(section => [section.class!.id, section.class])
    ).values()
  );

  // Group sections by class
  const sectionsByClass = teacherData.sections.reduce((acc, section) => {
    if (!section.class) return acc;
    
    const classId = section.class.id;
    if (!acc[classId]) {
      acc[classId] = [];
    }
    acc[classId].push(section);
    return acc;
  }, {} as Record<number, Section[]>);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // --- Render Section Card ---
  const renderSectionCard = (section: Section, showSubjectChips = true) => (
    <ListItem
      key={section.id}
      sx={{
        flexDirection: "column",
        alignItems: "flex-start",
        bgcolor: "rgba(255, 255, 255, 0.05)",
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
            {isClassTeacher(section) && showSubjectChips && (
              <Chip
                label="Class Teacher"
                color="primary"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            )}
            {isSubjectTeacher(section) &&
              showSubjectChips &&
              getTeacherSubjectIds(section).map((subjectId) => (
                <Chip
                  key={subjectId}
                  label={`Subject ${subjectId}`}
                  color="secondary"
                  variant="outlined"
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
    showSubjectChips = true
  ) => (
    <Grid item xs={12} md={6} lg={4} key={classItem.id}>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          bgcolor: "background.paper",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            color="primary.light"
          >
            {classItem.name}
          </Typography>
          <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
          <Typography
            variant="subtitle1"
            component="h3"
            gutterBottom
            color="text.secondary"
            sx={{ mb: 1.5 }}
          >
            {title}
          </Typography>
          {sections.length > 0 ? (
            <List disablePadding>
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
          p: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 3 }}
        >
          My Classes & Sections
        </Typography>

        <Paper
          elevation={3}
          sx={{
            width: "100%",
            mb: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
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
                  const sectionsForThisClass = sectionsByClass[classItem.id] || [];
                  if (sectionsForThisClass.length > 0) {
                    return renderClassCard(
                      classItem,
                      sectionsForThisClass,
                      "My Sections in this Class",
                      true
                    );
                  }
                  return null;
                })}
              </Grid>
            ) : (
              <Typography sx={{ textAlign: "center", p: 3 }}>
                No classes found based on your assigned sections.
              </Typography>
            )}
          </TabPanel>

          {/* --- Class Teacher Tab --- */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {uniqueClasses
                .map((classItem) => {
                  const classTeacherSections = (
                    sectionsByClass[classItem.id] || []
                  ).filter(isClassTeacher);

                  if (classTeacherSections.length === 0) return null;

                  return renderClassCard(
                    classItem,
                    classTeacherSections,
                    "Sections where you are Class Teacher",
                    false
                  );
                })
                .filter(Boolean)}
            </Grid>
            {uniqueClasses.every(
              (classItem) =>
                !(sectionsByClass[classItem.id] || []).some(isClassTeacher)
            ) && (
              <Typography sx={{ textAlign: "center", p: 3 }}>
                You are not assigned as a Class Teacher for any section.
              </Typography>
            )}
          </TabPanel>

          {/* --- Subject Teacher Tab --- */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {uniqueClasses
                .map((classItem) => {
                  const subjectTeacherSections = (
                    sectionsByClass[classItem.id] || []
                  ).filter(isSubjectTeacher);

                  if (subjectTeacherSections.length === 0) return null;

                  return renderClassCard(
                    classItem,
                    subjectTeacherSections,
                    "Sections where you are Subject Teacher",
                    true
                  );
                })
                .filter(Boolean)}
            </Grid>
            {uniqueClasses.every(
              (classItem) =>
                !(sectionsByClass[classItem.id] || []).some(isSubjectTeacher)
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
