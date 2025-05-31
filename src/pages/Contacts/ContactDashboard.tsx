import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  HStack,
  VStack,
  Box,
  Text,
  Select, // Added Select
  createListCollection, // Added createListCollection
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { Contact } from "./AddContact";
import type { Customer } from "../Customers/CustomerDashboard";
import { getCustomers } from "@/axios/customerApi";

interface ContactDashboardProps {
  contacts: Contact[];
  loading: boolean;
}

const PAGE_SIZE = 10;

// Header for the Contacts Dashboard with search and customer filter
const ContactHeader: React.FC<{
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customerFilter: string;
  onFilter: (value: string | null) => void; // Updated onFilter signature
  customerOptions: { value: string; label: string }[];
  isLoadingCustomers: boolean; // Added isLoadingCustomers
}> = React.memo(
  ({
    search,
    onSearch,
    customerFilter,
    onFilter,
    customerOptions,
    isLoadingCustomers, // Added isLoadingCustomers
  }) => (
    <HStack justifyContent="space-between" alignItems="center" mb={2} py={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Contacts Dashboard
      </Text>
      <HStack gap={2}>
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
          placeholder="Search contacts..."
          value={search}
          onChange={onSearch}
          size="sm"
          width="200px"
          borderRadius="md"
        />
        <Link to="add">
          <Button colorScheme="teal" size="sm">
            Create Contact
          </Button>
        </Link>
      </HStack>
    </HStack>
  )
);

// Table for displaying contacts with pagination
const ContactTable: React.FC<{
  contacts: (Contact & { customerName?: string })[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = React.memo(({ contacts, loading, page, setPage, totalPages }) => (
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
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Customer</Table.ColumnHeader>
            <Table.ColumnHeader>Primary</Table.ColumnHeader>
            <Table.ColumnHeader>Phone (Work)</Table.ColumnHeader>
            <Table.ColumnHeader>Phone (Mobile)</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={6}>Loading...</Table.Cell>
            </Table.Row>
          ) : contacts.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6}>No contacts found.</Table.Cell>
            </Table.Row>
          ) : (
            contacts.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.Cell>{(page - 1) * PAGE_SIZE + index + 1}</Table.Cell>
                <Table.Cell>
                  {item.firstName} {item.lastName}
                </Table.Cell>
                <Table.Cell>{item.emailAddress}</Table.Cell>
                <Table.Cell>{item.customerName || "N/A"}</Table.Cell>
                <Table.Cell>{item.isPrimary ? "Yes" : "No"}</Table.Cell>
                <Table.Cell>
                  {item.phoneNumbers?.find((p) => p.type === "Work")?.number ||
                    "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {item.phoneNumbers?.find((p) => p.type === "Mobile")
                    ?.number || "N/A"}
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
));

// Main Contacts Dashboard component
const ContactDashboard: React.FC<ContactDashboardProps> = ({
  contacts,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [customersMap, setCustomersMap] = useState<Record<string, string>>({});
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true); // Added isLoadingCustomers

  useEffect(() => {
    setIsLoadingCustomers(true); // Set loading true at the start
    getCustomers()
      .then((customerList: Customer[]) => {
        const validCustomers = Array.isArray(customerList) ? customerList : [];
        setCustomerOptions(
          validCustomers.map((c) => ({
            value: c.customerCode,
            label: `${c.airlineName || "Unnamed Customer"} (${c.customerCode})`,
          }))
        );
        const map: Record<string, string> = {};
        validCustomers.forEach((c) => {
          if (c.customerCode)
            map[c.customerCode] = c.airlineName || "Unnamed Customer";
        });
        setCustomersMap(map);
      })
      .catch((error) => {
        console.error("Failed to fetch customers for filter:", error);
        // Consider adding a toaster notification here for the user
        setCustomerOptions([]);
        setCustomersMap({});
      })
      .finally(() => setIsLoadingCustomers(false)); // Set loading false at the end
  }, []);

  // Add customerName to each contact for display
  const contactsWithCustomerName = useMemo(() => {
    return contacts.map((contact) => ({
      ...contact,
      customerName: contact.customerId
        ? customersMap[contact.customerId]
        : "Unknown",
    }));
  }, [contacts, customersMap]);

  // Filter contacts by customer and search
  const filtered = useMemo(() => {
    let result = contactsWithCustomerName;
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
  }, [contactsWithCustomerName, search, customerFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilter = (value: string | null) => {
    // Updated handleFilter signature
    setCustomerFilter(value || "");
    setPage(1);
  };

  return (
    <VStack align="stretch" gap={4} height="100%">
      <ContactHeader
        search={search}
        onSearch={handleSearch}
        customerFilter={customerFilter}
        onFilter={handleFilter}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers} // Pass isLoadingCustomers
      />
      <Box display={{ base: "block", md: "flex" }}>
        <Box flex={1} minW={0}>
          <ContactTable
            contacts={paginated}
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

export default ContactDashboard;
