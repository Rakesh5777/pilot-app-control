import React, { useEffect, useState, useMemo } from "react";
import {
  Heading,
  HStack,
  Box,
  Input,
  Text,
  VStack,
  Button,
  Select,
  Table,
  createListCollection,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Checklist, ChecklistFormData } from "./AddChecklist";
import { getCustomers } from "../../axios/customerApi";
import type { Customer } from "../Customers/CustomerDashboard";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";

interface ChecklistDashboardProps {
  checklists: Checklist[];
  loading: boolean;
}

const PAGE_SIZE = 10;

const ChecklistHeader: React.FC<{
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customerFilter: string;
  onFilter: (value: string | null) => void;
  customerOptions: { value: string; label: string }[];
  onAdd: () => void;
  isLoadingCustomers: boolean;
}> = React.memo(
  ({
    search,
    onSearch,
    customerFilter,
    onFilter,
    customerOptions,
    onAdd,
    isLoadingCustomers,
  }) => (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      mb={4}
      py={2}
      flexWrap="wrap"
      gap={3}
    >
      <Heading size="lg" color="fg.default" whiteSpace="nowrap">
        Checklists
      </Heading>
      <HStack
        gap={3}
        flexWrap="wrap"
        justifyContent={{ base: "flex-start", md: "flex-end" }}
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
          placeholder="Search ..."
          value={search}
          onChange={onSearch}
          size="sm"
          width="200px"
          borderRadius="md"
        />
        <Button
          colorScheme="blue"
          onClick={onAdd}
          size="md"
          whiteSpace="nowrap"
        >
          Add Checklist
        </Button>
      </HStack>
    </HStack>
  )
);

const ChecklistTable: React.FC<{
  checklists: Checklist[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = React.memo(({ checklists, isLoading, page, setPage, totalPages }) => {
  const questionHeaders = [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Q5",
    "Q6",
    "Q7",
    "Q8",
    "Q9",
  ];

  const fullQuestionsMap: Record<string, string> = {
    Q1: "Does the customer have iPads with iOS 16.6 or later?",
    Q2: "Can the iPads download apps through the App Store?",
    Q3: "Does FDC have Raw Flight Data with a minimum of 3 months of historical data?",
    Q4: "Does the airline provide AFRs WITH Crew Codes PRIOR to flights being processed?",
    Q5: "Does their Flight Data data frame documentation meet our requirements?",
    Q6: "Has the customer set SOP Alert thresholds in the PilotApp (Fuel) template within FDC?",
    Q7: "Has the customer been assisted in configuring the system in line with operational constraints and existing Safety & Fuel initiatives?",
    Q8: "Has the customer selected relevant Metrics (KPI's & scores) in PilotApp?",
    Q9: "Is the customer ready for a Live Trial?",
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        borderColor="border.default"
        overflowX="auto"
      >
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>#</Table.ColumnHeader>
              <Table.ColumnHeader>Customer Name</Table.ColumnHeader>
              <Table.ColumnHeader>Customer Code</Table.ColumnHeader>
              {questionHeaders.map((q) => (
                <Table.ColumnHeader key={q} textAlign="center" px={2}>
                  <Tooltip
                    content={fullQuestionsMap[q]}
                    positioning={{ placement: "top" }}
                  >
                    <Text as="span" cursor="default">
                      {q}
                    </Text>
                  </Tooltip>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={6}>Loading...</Table.Cell>
              </Table.Row>
            ) : checklists.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={questionHeaders.length + 4}
                  textAlign="center"
                  py={10}
                  fontSize="sm"
                  color="fg.muted"
                >
                  No checklists found for the current filter.
                </Table.Cell>
              </Table.Row>
            ) : (
              checklists.map((checklist, index) => (
                <Table.Row
                  key={checklist.id || index}
                  _hover={{ bg: "bg.subtle" }}
                >
                  <Table.Cell>{(page - 1) * PAGE_SIZE + index + 1}</Table.Cell>
                  <Table.Cell whiteSpace="nowrap">
                    {checklist.customerName || "N/A"}
                  </Table.Cell>
                  <Table.Cell whiteSpace="nowrap">
                    {checklist.customerId}
                  </Table.Cell>
                  {questionHeaders.map((qKey) => (
                    <Table.Cell key={qKey} textAlign="center" px={2}>
                      {checklist[
                        qKey.toLowerCase() as keyof ChecklistFormData
                      ] ? (
                        <Text color="green.600" fontWeight="medium">
                          Yes
                        </Text>
                      ) : (
                        <Text color="red.600" fontWeight="medium">
                          No
                        </Text>
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      {totalPages > 1 && (
        <HStack justifyContent="center" mt={4} mb={2}>
          <Button
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
            variant="outline"
          >
            Prev
          </Button>
          <Text fontSize="sm" mx={3} color="fg.muted">
            Page {page} of {totalPages}
          </Text>
          <Button
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || isLoading}
            variant="outline"
          >
            Next
          </Button>
        </HStack>
      )}
    </>
  );
});

const ChecklistDashboard: React.FC<ChecklistDashboardProps> = ({
  checklists: initialChecklists,
  loading: isLoadingInitialChecklists,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [customersMap, setCustomersMap] = useState<Record<string, string>>({});
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  useEffect(() => {
    setIsLoadingCustomers(true);
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
        toaster.create({
          title: "Error Loading Customers",
          description:
            "Could not load customer filter options. Please try again.",
          type: "error",
        });
        setCustomerOptions([]);
        setCustomersMap({});
      })
      .finally(() => setIsLoadingCustomers(false));
  }, []);

  const checklistsWithCustomerName = useMemo(() => {
    return initialChecklists.map((checklist) => ({
      ...checklist,
      customerName:
        checklist.customerName ||
        (checklist.customerId
          ? customersMap[checklist.customerId]
          : "Unknown Customer"),
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
            checklist.customerId.toLowerCase().includes(lowerSearchTerm)) ||
          Object.entries(checklist).some(([key, value]) => {
            if (key.match(/^q\d$/) && typeof value === "boolean") {
              return (value ? "yes" : "no").includes(lowerSearchTerm);
            }
            return false;
          })
      );
    }
    return result;
  }, [checklistsWithCustomerName, searchTerm, customerFilter]);

  const totalPages = Math.ceil(filteredChecklists.length / PAGE_SIZE);
  const paginatedChecklists = useMemo(
    () => filteredChecklists.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredChecklists, page]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (value: string | null) => {
    setCustomerFilter(value);
    setPage(1);
  };

  const handleAddChecklist = () => {
    navigate("/checklist/add");
  };

  const isLoading = isLoadingInitialChecklists || isLoadingCustomers;

  return (
    <VStack
      align="stretch"
      gap={4}
      p={{ base: 3, md: 5 }}
      flexGrow={1}
      minHeight="0"
      bg="bg.canvas"
      borderRadius="lg"
    >
      <ChecklistHeader
        search={searchTerm}
        onSearch={handleSearchChange}
        customerFilter={customerFilter || ""}
        onFilter={handleFilterChange}
        customerOptions={customerOptions}
        onAdd={handleAddChecklist}
        isLoadingCustomers={isLoadingCustomers}
      />
      <ChecklistTable
        checklists={paginatedChecklists}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </VStack>
  );
};

export default ChecklistDashboard;
