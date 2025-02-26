import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid2";

const testimonials = [
  {
    rating: 5,
    text: "The School Management System has streamlined our operations, making everything more efficient and user-friendly.",
    author: {
      name: "John Doe",
      role: "Principal, ABC School",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-26%20093721-LA9vFAbqlMXcm0o7Btz9VYZDL846rn.png",
    },
  },
  {
    rating: 5,
    text: "As a teacher, I appreciate the ease of managing classes and grades seamlessly.",
    author: {
      name: "Jane Smith",
      role: "Teacher, XYZ Academy",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-26%20093721-LA9vFAbqlMXcm0o7Btz9VYZDL846rn.png",
    },
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ bgcolor: "black", color: "white", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 1 }}>
          User Testimonials
        </Typography>

        <Typography sx={{ mb: 6, opacity: 0.9 }}>
          This system has transformed our school management.
        </Typography>

        <Grid container spacing={4} columns={{ xs: 8, md: 6 }}>
          {testimonials.map((testimonial, index) => (
            <Grid size={8} key={index}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Rating
                  value={testimonial.rating}
                  readOnly
                  sx={{
                    "& .MuiRating-icon": {
                      color: "white",
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.5,
                    fontStyle: "italic",
                    opacity: 0.9,
                  }}
                >
                  "{testimonial.text}"
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Avatar
                    src={testimonial.author.image}
                    alt={testimonial.author.name}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {testimonial.author.name}
                    </Typography>
                    <Typography sx={{ opacity: 0.8, fontSize: "0.875rem" }}>
                      {testimonial.author.role}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      ml: "auto",
                      opacity: 0.8,
                      fontSize: "0.875rem",
                    }}
                  >
                    Webflow
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
