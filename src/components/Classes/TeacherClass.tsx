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
import { useClass } from "../../services/queries/classes";
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
}

interface SubjectTeachers {
  [key: string]: number;
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

// TabPanel component for tab content
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
  const {
    data: teacherData,
    isLoading: isTeacherLoading,
    error: teacherError,
  } = useGetSingleTeacher(userData?.data?.user?.id);

  // Process sections with classes
  const sectionsWithClasses = React.useMemo(() => {
    if (!teacherData?.data?.sections) return [];

    return teacherData.data.sections.map((section: Section) => {
      // Try to fetch class data for each section
      const { data: classData } = useClass(section.classId);

      return {
        ...section,
        class: classData || {
          id: section.classId,
          name: `Class ${section.classId}`,
        },
      };
    });
  }, [teacherData]);

  // Extract unique classes from sections data
  const classes = React.useMemo(() => {
    if (!sectionsWithClasses.length) return [];

    const uniqueClasses = new Map<number, Class>();
    sectionsWithClasses.forEach((section) => {
      if (section.class) {
        uniqueClasses.set(section.class.id, section.class);
      }
    });

    return Array.from(uniqueClasses.values());
  }, [sectionsWithClasses]);

  // Group sections by class
  const sectionsByClass = React.useMemo(() => {
    if (!sectionsWithClasses.length) return new Map<number, Section[]>();

    const groupedSections = new Map<number, Section[]>();

    sectionsWithClasses.forEach((section) => {
      const classId = section.classId;
      if (!groupedSections.has(classId)) {
        groupedSections.set(classId, []);
      }
      groupedSections.get(classId)?.push(section);
    });

    return groupedSections;
  }, [sectionsWithClasses]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Determine if user is class teacher for a section
  const isClassTeacher = (section: Section): boolean => {
    return section.classTeacherId === teacherData?.data?.id;
  };

  // Determine if user is subject teacher for a section
  const isSubjectTeacher = (section: Section): boolean => {
    const teacherId = teacherData?.data?.id;
    return Object.values(section.subjectTeachers).includes(teacherId);
  };

  // Get subject IDs for which the logged-in teacher teaches
  const getTeacherSubjectIds = (section: Section): string[] => {
    const subjects: string[] = [];
    const teacherId = teacherData?.data?.id;

    Object.entries(section.subjectTeachers).forEach(([subjectId, id]) => {
      if (id === teacherId) {
        subjects.push(subjectId);
      }
    });
    return subjects;
  };

  // Loading state
  const isLoading = isUserLoading || isTeacherLoading;

  // Render loading state
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
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading class information...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Render error state
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
            Failed to load teacher data
          </Alert>
          <Typography variant="body1">
            Please try again later or contact support if the problem persists.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Render empty state - no sections assigned
  if (!teacherData?.data?.sections || teacherData.data.sections.length === 0) {
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
            }}
          >
            <Typography variant="h6" gutterBottom>
              You have no sections assigned
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please contact the administration to get your teaching schedule.
            </Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  // Render section card
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
          <Box sx={{ mt: 1 }}>
            {isClassTeacher(section) && showSubjectChips && (
              <Chip
                label="Class Teacher"
                color="primary"
                size="small"
                sx={{ mr: 1, mt: 1, fontWeight: "bold" }}
              />
            )}
            {isSubjectTeacher(section) &&
              showSubjectChips &&
              getTeacherSubjectIds(section).map((subjectId) => (
                <Chip
                  key={subjectId}
                  label={`Subject ${subjectId}`}
                  color="secondary"
                  size="small"
                  sx={{ mr: 1, mt: 1 }}
                />
              ))}
          </Box>
        }
      />
    </ListItem>
  );

  // Render class card
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
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            color="primary.light"
          >
            Class {classItem.name}
          </Typography>
          <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            color="text.secondary"
          >
            {title}
          </Typography>

          <List>
            {sections.map((section) =>
              renderSectionCard(section, showSubjectChips)
            )}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );

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
            mb: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="All Classes" />
            <Tab label="Class Teacher" />
            <Tab label="Subject Teacher" />
          </Tabs>

          {/* All Classes Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {classes.map((classItem) => {
                const sections = sectionsByClass.get(classItem.id) || [];
                return renderClassCard(classItem, sections, "Sections");
              })}
            </Grid>
          </TabPanel>

          {/* Class Teacher Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {classes.map((classItem) => {
                const classTeacherSections = (
                  sectionsByClass.get(classItem.id) || []
                ).filter(isClassTeacher);

                if (classTeacherSections.length === 0) return null;

                return renderClassCard(
                  classItem,
                  classTeacherSections,
                  "Your Class Teacher Sections",
                  false
                );
              })}
            </Grid>
          </TabPanel>

          {/* Subject Teacher Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {classes.map((classItem) => {
                const subjectTeacherSections = (
                  sectionsByClass.get(classItem.id) || []
                ).filter(isSubjectTeacher);

                if (subjectTeacherSections.length === 0) return null;

                return renderClassCard(
                  classItem,
                  subjectTeacherSections,
                  "Your Subject Teacher Sections",
                  true
                );
              })}
            </Grid>
          </TabPanel>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default TeacherClass;
