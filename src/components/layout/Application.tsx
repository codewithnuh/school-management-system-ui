import Box from "@mui/material/Box";
import ApplicantList from "./Applicant";
import { useApplications } from "../../services/queries/application";

const Application = () => {
  const { data } = useApplications();

  return (
    <div>
      <h1>Teacher Applications</h1>
      <p>Manage teacher applications and review their details.</p>
      <Box sx={{ mt: 4 }}>
        {/* <ApplicationsTable /> */}

        <ApplicantList applicants={data ? data.data.teachers : []} />
      </Box>
    </div>
  );
};

export default Application;
