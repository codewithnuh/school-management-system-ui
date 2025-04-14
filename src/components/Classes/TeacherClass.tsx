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
  createTheme,
  CssBaseline,
} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

// Type definitions based on the provided data structure
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
  sectionId: number | null;
  examId: number | null;
  class: Class;
}

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Lighter blue for better visibility on dark background
    },
    secondary: {
      main: "#ce93d8", // Lighter purple for better visibility on dark background
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const MyClasses: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  // Mock user ID (current teacher ID)
  const userId = 1001;

  // Mock data for sections and classes
  const mockSections: Section[] = [
    {
      id: 1,
      name: "A",
      classTeacherId: 1001, // Current teacher is class teacher
      subjectTeachers: { "101": 1001, "102": 1002 }, // Current teacher teaches subject 101
      classId: 1,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      sectionId: null,
      examId: null,
      class: { id: 1, name: "6th" },
    },
    {
      id: 2,
      name: "B",
      classTeacherId: 1002, // Another teacher is class teacher
      subjectTeachers: { "101": 1001, "102": 1002 }, // Current teacher teaches subject 101
      classId: 1,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      sectionId: null,
      examId: null,
      class: { id: 1, name: "6th" },
    },
    {
      id: 3,
      name: "A",
      classTeacherId: 1001, // Current teacher is class teacher
      subjectTeachers: { "201": 1001, "202": 1003 }, // Current teacher teaches subject 201
      classId: 2,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      sectionId: null,
      examId: null,
      class: { id: 2, name: "7th" },
    },
    {
      id: 4,
      name: "B",
      classTeacherId: 1003, // Another teacher is class teacher
      subjectTeachers: { "201": 1004, "202": 1003 }, // Current teacher doesn't teach any subject here
      classId: 2,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      sectionId: null,
      examId: null,
      class: { id: 2, name: "7th" },
    },
    {
      id: 5,
      name: "A",
      classTeacherId: 1004, // Another teacher is class teacher
      subjectTeachers: { "301": 1001, "302": 1004 }, // Current teacher teaches subject 301
      classId: 3,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      sectionId: null,
      examId: null,
      class: { id: 3, name: "8th" },
    },
  ];

  // Extract unique classes from sections data
  const classes = React.useMemo(() => {
    const uniqueClasses = new Map<number, Class>();
    mockSections.forEach((section) => {
      uniqueClasses.set(section.class.id, section.class);
    });

    return Array.from(uniqueClasses.values());
  }, []);

  // Group sections by class
  const sectionsByClass = React.useMemo(() => {
    const groupedSections = new Map<number, Section[]>();

    mockSections.forEach((section) => {
      const classId = section.class.id;
      if (!groupedSections.has(classId)) {
        groupedSections.set(classId, []);
      }
      groupedSections.get(classId)?.push(section);
    });

    return groupedSections;
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Determine if user is class teacher for a section
  const isClassTeacher = (section: Section) => {
    return section.classTeacherId === userId;
  };

  // Determine if user is subject teacher for a section
  const isSubjectTeacher = (section: Section) => {
    return Object.values(section.subjectTeachers).includes(userId);
  };

  // Get subject names for which the logged-in teacher teaches
  const getTeacherSubjects = (section: Section) => {
    const subjects: string[] = [];
    Object.entries(section.subjectTeachers).forEach(
      ([subjectId, teacherId]) => {
        if (teacherId === userId) {
          // Map of subject IDs to names
          const subjectNames: { [key: string]: string } = {
            "101": "Mathematics",
            "102": "Science",
            "201": "English",
            "202": "Social Studies",
            "301": "Physics",
            "302": "Chemistry",
          };
          subjects.push(subjectNames[subjectId] || `Subject ${subjectId}`);
        }
      }
    );
    return subjects;
  };

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

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {classes.map((classItem) => (
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
                      <Divider
                        sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />

                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        color="text.secondary"
                      >
                        Sections
                      </Typography>

                      <List>
                        {sectionsByClass.get(classItem.id)?.map((section) => (
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
                                  {isClassTeacher(section) && (
                                    <Chip
                                      label="Class Teacher"
                                      color="primary"
                                      size="small"
                                      sx={{ mr: 1, mt: 1, fontWeight: "bold" }}
                                    />
                                  )}
                                  {isSubjectTeacher(section) &&
                                    getTeacherSubjects(section).map(
                                      (subject) => (
                                        <Chip
                                          key={subject}
                                          label={subject}
                                          color="secondary"
                                          size="small"
                                          sx={{ mr: 1, mt: 1 }}
                                        />
                                      )
                                    )}
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {classes.map((classItem) => {
                const classTeacherSections =
                  sectionsByClass.get(classItem.id)?.filter(isClassTeacher) ||
                  [];
                if (classTeacherSections.length === 0) return null;

                return (
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
                        <Divider
                          sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }}
                        />

                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          color="text.secondary"
                        >
                          Your Class Teacher Sections
                        </Typography>

                        <List>
                          {classTeacherSections.map((section) => (
                            <ListItem
                              key={section.id}
                              sx={{
                                bgcolor: "rgba(255, 255, 255, 0.05)",
                                borderRadius: 1,
                                mb: 1,
                                p: 2,
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body1"
                                    fontWeight="medium"
                                  >
                                    Section {section.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Class Teacher Responsibility
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {classes.map((classItem) => {
                const subjectTeacherSections =
                  sectionsByClass.get(classItem.id)?.filter(isSubjectTeacher) ||
                  [];
                if (subjectTeacherSections.length === 0) return null;

                return (
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
                        <Divider
                          sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }}
                        />

                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          color="text.secondary"
                        >
                          Your Subject Teacher Sections
                        </Typography>

                        <List>
                          {subjectTeacherSections.map((section) => (
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
                                  <Typography
                                    variant="body1"
                                    fontWeight="medium"
                                  >
                                    Section {section.name}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ mt: 1 }}>
                                    {getTeacherSubjects(section).map(
                                      (subject) => (
                                        <Chip
                                          key={subject}
                                          label={subject}
                                          color="secondary"
                                          size="small"
                                          sx={{
                                            mr: 1,
                                            mt: 0.5,
                                            fontWeight: "medium",
                                          }}
                                        />
                                      )
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default MyClasses;
