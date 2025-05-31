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

export interface Customer {
  airlineName: string;
  customerCode: string;
  iataCode: string;
  businessRegistrationNumber: string;
  countryRegion: string;
  fleetSize: string;
  industry: string;
  customerType: string;
  comment: string;
}

interface CustomerDashboardProps {
  customers: Customer[];
  loading: boolean;
}

const PAGE_SIZE = 10;

const CustomerHeader: React.FC<{
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = React.memo(({ search, onSearch }) => (
  <HStack justifyContent="space-between" alignItems="center" mb={2} py={4}>
    <Text fontSize="2xl" fontWeight="bold">
      Customers Dashboard
    </Text>
    <HStack gap={2}>
      <Input
        placeholder="Search customers..."
        value={search}
        onChange={onSearch}
        size="sm"
        width="200px"
        borderRadius="md"
      />
      <Link to="add">
        <Button colorScheme="teal" size="sm">
          Create Customer
        </Button>
      </Link>
    </HStack>
  </HStack>
));

const CustomerTable: React.FC<{
  customers: Customer[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = React.memo(({ customers, loading, page, setPage, totalPages }) => (
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
            <Table.ColumnHeader>Airline Name</Table.ColumnHeader>
            <Table.ColumnHeader>Customer Code</Table.ColumnHeader>
            <Table.ColumnHeader>IATA Code</Table.ColumnHeader>
            <Table.ColumnHeader>Business Reg. No.</Table.ColumnHeader>
            <Table.ColumnHeader>Country/Region</Table.ColumnHeader>
            <Table.ColumnHeader>Fleet Size</Table.ColumnHeader>
            <Table.ColumnHeader>Industry</Table.ColumnHeader>
            <Table.ColumnHeader>Customer Type</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8}>Loading...</Table.Cell>
            </Table.Row>
          ) : customers.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={8}>No customers found.</Table.Cell>
            </Table.Row>
          ) : (
            customers.map((item, index) => (
              <Table.Row key={item.customerCode}>
                <Table.Cell>{(page - 1) * PAGE_SIZE + index + 1}</Table.Cell>
                <Table.Cell>{item.airlineName}</Table.Cell>
                <Table.Cell>{item.customerCode}</Table.Cell>
                <Table.Cell>{item.iataCode}</Table.Cell>
                <Table.Cell>{item.businessRegistrationNumber}</Table.Cell>
                <Table.Cell>{item.countryRegion}</Table.Cell>
                <Table.Cell>{item.fleetSize}</Table.Cell>
                <Table.Cell>{item.industry}</Table.Cell>
                <Table.Cell>{item.customerType}</Table.Cell>
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

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  customers,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search) return customers;
    return customers.filter((c) =>
      Object.values(c).some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <VStack align="stretch" gap={4} height="100%">
      <CustomerHeader search={search} onSearch={handleSearch} />
      <CustomerTable
        customers={paginated}
        loading={loading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </VStack>
  );
};

export default CustomerDashboard;
