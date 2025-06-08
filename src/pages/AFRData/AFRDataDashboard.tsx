import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  HStack,
  VStack,
  Box,
  Text,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import type { AFRDataType } from "./AddAFRData";
import { getCustomers } from "@/axios/customerApi";
import { displayOrDash } from "@/utils/utils";

interface AFRDataDashboardProps {
  afrData: AFRDataType[];
  loading: boolean;
}

const PAGE_SIZE = 10;

const AFRDataHeader: React.FC<{
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customerFilter: string;
  onFilter: (value: string | null) => void;
  customerOptions: { value: string; label: string }[];
  isLoadingCustomers: boolean;
}> = React.memo(
  ({
    search,
    onSearch,
    customerFilter,
    onFilter,
    customerOptions,
    isLoadingCustomers,
  }) => (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      py={4}
      flexWrap="wrap"
    >
      <Text fontSize="2xl" fontWeight="bold">
        AFR Data Dashboard
      </Text>
      <HStack
        flexWrap="wrap"
        justifyContent={{ base: "flex-start", md: "flex-end" }}
        gap={2}
      >
        <Select.Root
          width={{ base: "100%", sm: "200px" }}
          value={customerFilter ? [customerFilter] : []}
          onValueChange={(details) => onFilter(details.value[0] || null)}
          collection={createListCollection({
            items: [{ value: "", label: "All Customers" }, ...customerOptions],
            itemToString: (item) => item.label,
            itemToValue: (item) => item.value,
          })}
          disabled={isLoadingCustomers || customerOptions.length === 0}
        >
          <Select.Trigger borderRadius="md">
            <Select.ValueText placeholder="Filter by Customer" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Positioner>
            <Select.Content>
              <Select.Item item={{ value: "", label: "All Customers" }}>
                <Select.ItemText>All Customers</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
              {customerOptions.map((opt) => (
                <Select.Item key={opt.value} item={opt}>
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
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
  )
);

const AFRDataTable: React.FC<{
  afrData: (AFRDataType & {
    customerName?: string;
    customerCode?: string;
  })[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = React.memo(({ afrData, loading, page, setPage, totalPages }) => {
  const navigate = useNavigate();
  return (
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
              <Table.ColumnHeader>Customer Name</Table.ColumnHeader>
              <Table.ColumnHeader>Customer Code</Table.ColumnHeader>
              <Table.ColumnHeader>Flights Total</Table.ColumnHeader>
              <Table.ColumnHeader>Organization</Table.ColumnHeader>
              <Table.ColumnHeader>Flights With AFR</Table.ColumnHeader>
              <Table.ColumnHeader>Flights With Captain Code</Table.ColumnHeader>
              <Table.ColumnHeader>
                Percentage With Captain Code
              </Table.ColumnHeader>
              <Table.ColumnHeader>Pilot App Suitable</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={9}>Loading...</Table.Cell>
              </Table.Row>
            ) : afrData.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={9}>No AFR data found.</Table.Cell>
              </Table.Row>
            ) : (
              afrData.map((item, index) => (
                <Table.Row
                  key={item.id || index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/afrdata/edit/${item.id}`);
                  }}
                >
                  <Table.Cell>{(page - 1) * PAGE_SIZE + index + 1}</Table.Cell>
                  <Table.Cell>{displayOrDash(item.customerName)}</Table.Cell>
                  <Table.Cell>{displayOrDash(item.customerCode)}</Table.Cell>
                  <Table.Cell>{displayOrDash(item.flightsTotal)}</Table.Cell>
                  <Table.Cell>{displayOrDash(item.organization)}</Table.Cell>
                  <Table.Cell>{displayOrDash(item.flightsWithAFR)}</Table.Cell>
                  <Table.Cell>
                    {displayOrDash(item.flightsWithCaptainCode)}
                  </Table.Cell>
                  <Table.Cell>
                    {displayOrDash(item.percentageWithCaptainCode)}
                  </Table.Cell>
                  <Table.Cell>
                    {item.pilotAppSuitable ? "Yes" : "No"}
                  </Table.Cell>
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
  );
});

const AFRDataDashboard: React.FC<AFRDataDashboardProps> = ({
  afrData,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [customersMap, setCustomersMap] = useState<
    Record<string, { name: string; code: string }>
  >({});
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  useEffect(() => {
    setIsLoadingCustomers(true);
    getCustomers()
      .then((customerList: { customerCode: string; airlineName: string }[]) => {
        const validCustomers = Array.isArray(customerList) ? customerList : [];
        setCustomerOptions(
          validCustomers.map((c) => ({
            value: c.customerCode,
            label: `${c.airlineName || "Unnamed Customer"} (${c.customerCode})`,
          }))
        );
        const map: Record<string, { name: string; code: string }> = {};
        validCustomers.forEach((c) => {
          if (c.customerCode)
            map[c.customerCode] = {
              name: c.airlineName || "Unnamed Customer",
              code: c.customerCode,
            };
        });
        setCustomersMap(map);
      })
      .catch(() => {
        setCustomerOptions([]);
        setCustomersMap({});
      })
      .finally(() => setIsLoadingCustomers(false));
  }, []);

  // Add customerName and customerCode to each afrData row
  const afrDataWithCustomer = useMemo(() => {
    return afrData.map((item) => ({
      ...item,
      customerName: item.customerId
        ? customersMap[item.customerId]?.name
        : "Unknown",
      customerCode: item.customerId
        ? customersMap[item.customerId]?.code
        : "Unknown",
    }));
  }, [afrData, customersMap]);

  // Filter by customer and search
  const filtered = useMemo(() => {
    let result = afrDataWithCustomer;
    if (customerFilter) {
      result = result.filter((c) => c.customerId === customerFilter);
    }
    if (!search) return result;
    return result.filter((c) =>
      Object.values(c).some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [afrDataWithCustomer, search, customerFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilter = (value: string | null) => {
    setCustomerFilter(value || "");
    setPage(1);
  };

  return (
    <VStack align="stretch" gap={4} height="100%" p={{ base: 3, md: 5 }}>
      <AFRDataHeader
        search={search}
        onSearch={handleSearch}
        customerFilter={customerFilter}
        onFilter={handleFilter}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers}
      />
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
