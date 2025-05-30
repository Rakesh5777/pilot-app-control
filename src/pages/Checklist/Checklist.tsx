import React from "react";
import ChecklistDashboard from "./ChecklistDashboard";
import { NoDataFound } from "../../components/NoDataFound"; // Corrected path
import { getChecklists } from "../../axios/checklistApi"; // Corrected path
import type { Checklist } from "./AddChecklist";
import { Box } from "@chakra-ui/react";

const ChecklistPage: React.FC = () => {
  const [checklists, setChecklists] = React.useState<Checklist[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true); // Explicitly set loading to true at the start of the effect
    getChecklists()
      .then((data) => setChecklists(data))
      .catch((error) => {
        // Added error handling
        console.error("Failed to fetch checklists:", error);
        // Optionally, set checklists to an empty array or show an error message
        setChecklists([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Show loading indicator if loading and no checklists yet
  if (loading && checklists.length === 0) {
    return <Box p={4}>Loading checklists...</Box>;
  }

  // Show NoDataFound if not loading and no checklists are found
  if (!loading && checklists.length === 0) {
    return <NoDataFound title="No checklists found." routeLink="add" />;
  }

  // Render the dashboard with the fetched checklists
  return <ChecklistDashboard checklists={checklists} loading={loading} />;
};

export default ChecklistPage;
