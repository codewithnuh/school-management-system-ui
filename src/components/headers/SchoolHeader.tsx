import React from "react";
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  Avatar,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

interface SchoolInfo {
  name: string;
  brandColor: string;
  logo: string;
}

interface SchoolHeaderProps {
  school: SchoolInfo;
}

const SchoolHeader: React.FC<SchoolHeaderProps> = ({ school }) => {
  const theme = useTheme();
  console.log(school);
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: 700,
        margin: "2rem auto 2rem",
        padding: 3,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.9)",
        borderRadius: 2,
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)"
        }`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0, 0, 0, 0.3)"
            : "0 4px 20px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 25px rgba(0, 0, 0, 0.4)"
              : "0 8px 25px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems="center"
      >
        {/* Logo Section */}
        <Avatar
          src={school.logo}
          alt={`${school.name} Logo`}
          sx={{
            width: 80,
            height: 80,
            borderRadius: 2,
            border: `2px solid ${school.brandColor}`,
            boxShadow: `0 0 8px ${school.brandColor}80`,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
            backgroundColor: "transparent",
          }}
        >
          <SchoolIcon sx={{ fontSize: 40 }} />
        </Avatar>

        {/* School Information */}
        <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight={600}
            sx={{
              mb: 1,
              color: theme.palette.text.primary,
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 0 10px rgba(255,255,255,0.1)"
                  : "none",
            }}
          >
            {school.name}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent={{ xs: "center", sm: "flex-start" }}
          >
            <Tooltip title="School Brand Color">
              <Chip
                label="Brand Color"
                sx={{
                  backgroundColor: "#0034",
                  color: "#fff",
                  fontWeight: 500,

                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 0 12px ${school.brandColor}cc`,
                  },
                }}
              />
            </Tooltip>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontFamily: "monospace",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? school.brandColor
                    : school.brandColor,
                padding: "4px 8px",
                borderRadius: 1,
              }}
            >
              {school.brandColor}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SchoolHeader;
