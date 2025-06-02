import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  HStack,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { AFRDataType } from "./AddAFRData";

interface AFRDataDashboardProps {
  afrData: AFRDataType[];
  loading: boolean;
}

const PAGE_SIZE = 10;

const AFRDataHeader: React.FC<{
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = React.memo(({ search, onSearch }) => (
  <HStack justifyContent="space-between" alignItems="center" mb={2} py={4}>
    <Text fontSize="2xl" fontWeight="bold">
      AFR Data Dashboard
    </Text>
    <HStack
      flexWrap="wrap"
      justifyContent={{ base: "flex-start", md: "flex-end" }}
      gap={2}
    >
      <Input
        placeholder="Search AFR data..."
        value={search}
        onChange={onSearch}
        size="sm"
        width="200px"
        borderRadius="md"
      />
      <Link to="add">
        <Button colorScheme="teal" size="sm">
          Create AFR Data
        </Button>
      </Link>
    </HStack>
  </HStack>
));

const AFRDataTable: React.FC<{
  afrData: AFRDataType[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = React.memo(({ afrData, loading, page, setPage, totalPages }) => (
  <>
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor="border.default"
      overflowX="auto"
      overflowY="auto"
    >
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>#</Table.ColumnHeader>
            <Table.ColumnHeader>Flights Total</Table.ColumnHeader>
            <Table.ColumnHeader>Organization</Table.ColumnHeader>
            <Table.ColumnHeader>Flights With AFR</Table.ColumnHeader>
            <Table.ColumnHeader>Flights With Captain Code</Table.ColumnHeader>
            <Table.ColumnHeader>Percentage With Captain Code</Table.ColumnHeader>
            <Table.ColumnHeader>Pilot App Suitable</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7}>Loading...</Table.Cell>
            </Table.Row>
          ) : afrData.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7}>No AFR data found.</Table.Cell>
            </Table.Row>
          ) : (
            afrData.map((item, index) => (
              <Table.Row key={item.id || index}>
                <Table.Cell>{(page - 1) * PAGE_SIZE + index + 1}</Table.Cell>
                <Table.Cell>{item.flightsTotal}</Table.Cell>
                <Table.Cell>{item.organization}</Table.Cell>
                <Table.Cell>{item.flightsWithAFR}</Table.Cell>
                <Table.Cell>{item.flightsWithCaptainCode}</Table.Cell>
                <Table.Cell>{item.percentageWithCaptainCode}</Table.Cell>
                <Table.Cell>{item.pilotAppSuitable ? "Yes" : "No"}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
    {totalPages > 1 && (
      <HStack justifyContent="center" mt={2}>
        <Button
          size="xs"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <Text fontSize="sm">
          Page {page} of {totalPages}
        </Text>
        <Button
          size="xs"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </HStack>
    )}
  </>
));

const AFRDataDashboard: React.FC<AFRDataDashboardProps> = ({
  afrData,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const result = afrData;
    if (!search) return result;
    return result.filter((item) =>
      Object.values(item).some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [afrData, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <VStack align="stretch" gap={4} height="100%" p={{ base: 3, md: 5 }}>
      <AFRDataHeader search={search} onSearch={handleSearch} />
      <Box display={{ base: "block", md: "flex" }}>
        <Box flex={1} minW={0}>
          <AFRDataTable
            afrData={paginated}
            loading={loading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </Box>
      </Box>
    </VStack>
  );
};

export default AFRDataDashboard;
