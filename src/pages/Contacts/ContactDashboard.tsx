import React, { useState, useMemo, useEffect } from "react";
import { Table, Button, Input, HStack, VStack, Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { Contact } from "./AddContact";
import type { Customer } from "../Customers/CustomerDashboard";
import { getCustomers } from "@/axios/customerApi";


interface ContactDashboardProps {
  contacts: Contact[];
  loading: boolean;
}

const PAGE_SIZE = 10;

const ContactHeader: React.FC<{
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customerFilter: string;
  onFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  customerOptions: { value: string; label: string }[];
}> = React.memo(
  ({ search, onSearch, customerFilter, onFilter, customerOptions }) => (
    <HStack justifyContent="space-between" alignItems="center" mb={2} py={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Contacts Dashboard
      </Text>
      <HStack gap={2}>
        <select
          style={{
            width: 200,
            height: 32,
            borderRadius: 6,
            border: "1px solid #CBD5E0",
            padding: "0 8px",
          }}
          value={customerFilter}
          onChange={onFilter}
        >
          <option value="">Filter by Customer</option>
          {customerOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

const ContactTable: React.FC<{
  contacts: (Contact & { customerName?: string })[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = React.memo(({ contacts, loading, page, setPage, totalPages }) => (
  <>
    <Box
      flex={1}
      overflowX="auto"
      overflowY="auto"
      minH="300px"
      maxH="60vh"
      mt={2}
    >
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
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
            contacts.map((item) => (
              <Table.Row key={item.id}>
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

  useEffect(() => {
    getCustomers().then((customerList: Customer[]) => {
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
    });
  }, []);

  const contactsWithCustomerName = useMemo(() => {
    return contacts.map((contact) => ({
      ...contact,
      customerName: contact.customerId
        ? customersMap[contact.customerId]
        : "Unknown",
    }));
  }, [contacts, customersMap]);

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

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomerFilter(e.target.value);
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