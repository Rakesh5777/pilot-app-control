import React, { useEffect, useState, useMemo } from "react";
import {
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  Button,
  Box,
  IconButton,
  Select, // Standard Chakra UI Select
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'; // For search icon
import { ChevronRightIcon } from '@chakra-ui/icons'; // For action button icon
import { useNavigate } from "react-router-dom";
import type { Checklist, ChecklistFormData } from "./AddChecklist";
import { getCustomers } from "../../axios/customerApi";
import type { Customer } from "../Customers/CustomerDashboard";

interface ChecklistDashboardProps {
  checklists: Checklist[];
  loading: boolean;
}

const PAGE_SIZE = 10;

// Header for the Checklist Dashboard
const ChecklistHeader: React.FC<{
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customerFilter: string;
  onFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  customerOptions: { value: string; label: string }[];
  onAdd: () => void;
}> = React.memo(
  ({ search, onSearch, customerFilter, onFilter, customerOptions, onAdd }) => (
    <HStack justifyContent="space-between" alignItems="center" mb={2} py={4}>
      <Heading size="lg" color="gray.700">
        Checklists
      </Heading>
      <HStack gap={2}>
        <Select
          placeholder="Filter by Customer"
          value={customerFilter}
          onChange={onFilter}
          size="md"
          width="200px"
          borderRadius="md"
        >
          {customerOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <InputGroup size="md" width="200px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            pl="2.5rem"
            type="text"
            placeholder="Search checklists..."
            value={search}
            onChange={onSearch}
            borderRadius="md"
          />
        </InputGroup>
        <Button colorScheme="blue" onClick={onAdd} size="md">
          Add Checklist
        </Button>
      </HStack>
    </HStack>
  )
);

// Table for displaying checklists with pagination
const ChecklistTable: React.FC<{
  checklists: Checklist[]; 
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = React.memo(({ checklists, loading, page, setPage, totalPages }) => {
  const questionHeaders = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"];

  return (
    <>
      <TableContainer
        flex={1}
        overflowX="auto"
        overflowY="auto"
        minH="300px"
        maxH="60vh"
        mt={2}
        borderWidth="1px"
        borderRadius="lg"
        borderColor="gray.200"
      >
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>#</Th>
              <Th>Customer Name</Th>
              <Th>Customer Code</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              {questionHeaders.map((q) => (
                <Th key={q}>{q}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading && checklists.length === 0 ? (
              <Tr>
                <Td colSpan={questionHeaders.length + 5}>Loading...</Td>
              </Tr>
            ) : !loading && checklists.length === 0 ? (
              <Tr>
                <Td colSpan={questionHeaders.length + 5}>
                  No checklists found.
                </Td>
              </Tr>
            ) : (
              checklists.map((checklist, index) => (
                <Tr key={checklist.id}>
                  <Td>{(page - 1) * PAGE_SIZE + index + 1}</Td>
                  <Td>{checklist.customerName || "N/A"}</Td>
                  <Td>{checklist.customerId}</Td>
                  <Td>N/A</Td> 
                  <Td>N/A</Td> 
                  {questionHeaders.map((qKey) => (
                    <Td key={qKey}>
                      {checklist[qKey as keyof ChecklistFormData] ? "Yes" : "No"}
                    </Td>
                  ))}
                  <Td>
                    <IconButton
                      aria-label="View details"
                      icon={<ChevronRightIcon />} // Using Chakra UI icon
                      size="sm"
                      variant="ghost"
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <HStack justifyContent="center" mt={4} mb={2}>
          <Button
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Text fontSize="sm" mx={2}>
            Page {page} of {totalPages}
          </Text>
          <Button
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </HStack>
      )}
    </>
  );
});

// Main Checklist Dashboard component
const ChecklistDashboard: React.FC<ChecklistDashboardProps> = ({
  checklists: initialChecklists,
  loading: initialLoading,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [customersMap, setCustomersMap] = useState<Record<string, string>>({});
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  useEffect(() => {
    setLoadingCustomers(true);
    getCustomers()
      .then((customerList: Customer[]) => {
        setCustomerOptions(
          customerList.map((c) => ({
            value: c.customerCode,
            label: `${c.airlineName} (${c.customerCode})`,
          }))
        );
        const map: Record<string, string> = {};
        customerList.forEach((c) => {
          if (c.customerCode) map[c.customerCode] = c.airlineName;
        });
        setCustomersMap(map);
      })
      .catch((error) => {
        console.error("Failed to fetch customers:", error);
        setCustomerOptions([]);
        setCustomersMap({});
      })
      .finally(() => setLoadingCustomers(false));
  }, []);

  const checklistsWithCustomerName = useMemo(() => {
    return initialChecklists.map((checklist) => ({
      ...checklist,
      customerName: checklist.customerId
        ? customersMap[checklist.customerId]
        : "Unknown",
    }));
  }, [initialChecklists, customersMap]);

  const filteredChecklists = useMemo(() => {
    let result = checklistsWithCustomerName;
    if (customerFilter) {
      result = result.filter((c) => c.customerId === customerFilter);
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (checklist) =>
          (checklist.customerName &&
            checklist.customerName.toLowerCase().includes(lowerSearchTerm)) ||
          (checklist.customerId &&
            checklist.customerId.toLowerCase().includes(lowerSearchTerm))
      );
    }
    return result;
  }, [checklistsWithCustomerName, searchTerm, customerFilter]);

  const totalPages = Math.ceil(filteredChecklists.length / PAGE_SIZE);
  const paginatedChecklists = useMemo(
    () =>
      filteredChecklists.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      ),
    [filteredChecklists, page]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomerFilter(e.target.value);
    setPage(1);
  };
  
  const isLoading = initialLoading || loadingCustomers;

  return (
    <VStack align="stretch" gap={4} height="100%" p={{ base: 4, md: 8 }}>
      <ChecklistHeader
        search={searchTerm}
        onSearch={handleSearch}
        customerFilter={customerFilter}
        onFilter={handleFilter}
        customerOptions={customerOptions}
        onAdd={() => navigate("/checklist/add")}
      />
      <Box display={{ base: "block", md: "flex" }} flex={1} minH={0}>
        <Box flex={1} minW={0} display="flex" flexDirection="column">
          <ChecklistTable
            checklists={paginatedChecklists}
            loading={isLoading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </Box>
      </Box>
    </VStack>
  );
};

export default ChecklistDashboard;
