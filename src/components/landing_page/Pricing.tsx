import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const features = [
  "Student Information System",
  "Attendance Tracking",
  "Grade Management",
  "Teacher & Staff Profiles",
  "Parent Communication",
  "Timetable Scheduling",
  "Fee Collection & Reports",
];

const plans = [
  {
    title: "Monthly Plan",
    price: "$19",
    cycle: "/month",
    background: "black)",
    blur: "10px",
  },
  {
    title: "Yearly Plan",
    price: "$190",
    cycle: "/year (2 months free)",
    background: "rgba(255, 255, 255, 0.08)",
    blur: "12px",
  },
];

export default function PricingSection() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 10,
        px: 4,
        background: "black/50",
        color: "white",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Transparent Pricing for Schools
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 6 }}>
        Choose the plan that fits your institution's needs
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: plan.background,
                backdropFilter: `blur(${plan.blur})`,
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {plan.price}
                  <Typography component="span" variant="subtitle1">
                    {plan.cycle}
                  </Typography>
                </Typography>

                <List>
                  {features.map((feature, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: "#90caf9" }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: "#2196f3",
                    color: "white",
                    borderRadius: "10px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#1976d2",
                    },
                  }}
                >
                  Choose {plan.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
