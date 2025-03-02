import { useNavigate } from "react-router";
import { useAuthCheck } from "../hooks/useAuth"; // Adjust path if needed

const Dashboard = () => {
  const authCheckResult = useAuthCheck(); // Get the whole result object
  const navigate = useNavigate();

  console.log("Dashboard Component - useAuthCheckResult:", authCheckResult); // Log the whole result

  const { data, isLoading, isError } = authCheckResult; // Destructure from result

  if (isLoading) {
    return <div>Loading Dashboard...</div>;
  }

  if (isError) {
    console.error(
      "Error checking authentication for dashboard access",
      isError
    );
    return <div>Error loading dashboard. Please try again later.</div>;
  }

  if (!data?.isAuthenticated) {
    // Access isAuthenticated from data
    navigate("/login", { replace: true });
    return null;
  }

  if (data?.role !== "ADMIN") {
    // Access role from data
    navigate("/unauthorized", { replace: true });
    return null;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the Admin Dashboard!</p>
      {/* Add your Admin-specific dashboard content here */}
    </div>
  );
};

export default Dashboard;
