import React, { useEffect } from 'react';
import AFRDataDashboard from "./AFRDataDashboard";
import { NoDataFound } from "@/components/NoDataFound";
import type { AFRDataType } from "./AddAFRData";
import { Box } from "@chakra-ui/react";
import { getAFRData } from '@/axios/afrDataApi';


const AFRData: React.FC = () => {
  const [afrData, setAfrData] = React.useState<AFRDataType[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getAFRData()
      .then((data: AFRDataType[]) => setAfrData(data))
      .catch(error => {
        console.error("Failed to fetch AFR data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading && afrData.length === 0) return <Box p={4}>Loading AFR Data...</Box>;

  if (!loading && afrData.length === 0) {
    return <NoDataFound title="AFR Data" routeLink="add" />;
  }

  return <AFRDataDashboard afrData={afrData} loading={loading} />;
};

export default AFRData;
