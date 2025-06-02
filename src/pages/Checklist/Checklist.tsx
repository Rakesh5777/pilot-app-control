import React from "react";
import ChecklistDashboard from "./ChecklistDashboard";
import { NoDataFound } from "../../components/NoDataFound";
import { getChecklists } from "../../axios/checklistApi";
import type { Checklist } from "./AddChecklist";
import { Box } from "@chakra-ui/react";

const ChecklistPage: React.FC = () => {
  const [checklists, setChecklists] = React.useState<Checklist[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    getChecklists()
      .then((data) => setChecklists(data))
      .catch((error) => {
        console.error("Failed to fetch checklists:", error);
        setChecklists([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading && checklists.length === 0) {
    return <Box p={4}>Loading checklists...</Box>;
  }

  if (!loading && checklists.length === 0) {
    return <NoDataFound title="No checklists found." routeLink="add" />;
  }

  return <ChecklistDashboard checklists={checklists} loading={loading} />;
};

export default ChecklistPage;
