import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  Fieldset,
  Heading,
  HStack,
  RadioGroup,
  Select,
  Text,
  VStack,
  createListCollection,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useCreationStore } from "@/store/creationStore";
import { addChecklist } from "@/axios/checklistApi";
import { getCustomers } from "@/axios/customerApi";

export interface ChecklistFormData {
  id?: string;
  customerId?: string;
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  q5: boolean;
  q6: boolean;
  q7: boolean;
  q8: boolean;
  q9: boolean;
}

export interface Checklist extends ChecklistFormData {
  id: string;
  customerName: string;
}

const AddChecklist: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerData, resetStore } = useCreationStore();
  const [selectedCustomerCode, setSelectedCustomerCode] = useState<
    string | undefined
  >(customerData?.customerCode);
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    getCustomers().then(
      (customers: { customerCode: string; airlineName: string }[]) => {
        setCustomerOptions(
          customers.map((c) => ({
            value: c.customerCode,
            label: `${c.airlineName} (${c.customerCode})`,
          }))
        );
      }
    );
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<ChecklistFormData>({
    defaultValues: {
      q1: false,
      q2: false,
      q3: false,
      q4: false,
      q5: false,
      q6: false,
      q7: false,
      q8: false,
      q9: false,
    },
    mode: "onTouched",
  });

  const isCustomerCreationFlow = location.pathname.includes(
    "/customers/add/checklist"
  );

  useEffect(() => {
    if (isCustomerCreationFlow && customerData) {
      setSelectedCustomerCode(customerData.customerCode);
      // You might want to prefill other checklist items if applicable
    }
  }, [isCustomerCreationFlow, customerData]);

  const onSubmit = async (data: ChecklistFormData) => {
    try {
      if (!selectedCustomerCode) {
        toaster.create({
          title: "Error",
          description: "Customer Code is missing.",
          type: "error",
        });
        return;
      }
      await addChecklist({
        ...data,
        customerId: selectedCustomerCode,
        // @ts-expect-error: allow customerName for backend display
        customerName:
          customerOptions
            .find((opt) => opt.value === selectedCustomerCode)
            ?.label?.split(" (")[0] || "",
      });
      toaster.create({
        title: "Checklist Added.",
        description: "Successfully saved checklist for the customer.",
        type: "success",
      });
      if (isCustomerCreationFlow) {
        resetStore(); // Reset store after full creation flow
        navigate("/customers");
      } else {
        navigate("/checklist");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toaster.create({
        title: "Error",
        description: "Failed to save data.",
        type: "error",
      });
    }
  };

  const onError = () => {
    toaster.create({
      title: "Validation Error.",
      description: "Please check the form for errors.",
      type: "error",
    });
  };

  const handlePrevious = () => {
    if (isCustomerCreationFlow) {
      // Assuming contact data is passed and we need to go back to add contact
      navigate("/customers/add/contact");
    } else {
      navigate("/checklist");
    }
  };

  const checklistItems = [
    { name: "q1", label: "Does the cutsomer have iPads with iOS 16.6 or l." },
    { name: "q2", label: "Can the iPads download apps through the App Store?" },
    { name: "q3", label: "Does FDC have Raw Flight Data with a minimum of 3 months of historical" },
    { name: "q4", label: "Does the airline provide AFRs WITH Crew Codes PRIOR to flights being proce" },
    { name: "q5", label: "Does their Flight Data data frame documentation meet our require" },
    { name: "q6", label: "Has the customer set SOP Alert thresholds in the PilotApp (Fuel) template withi" },
    { name: "q7", label: "Has the customer been assisted in configuring the system in line with operational cons and existing Safety & Fuel initiatives?" },
    { name: "q8", label: "Has the customer selected relevent Metrics (KPI\'s & scores) in PilotApp?" },
    { name: "q9", label: "Ready for a Live Trial?" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      style={{ maxWidth: 900, margin: "8px 0 8px 16px", padding: 16 }}
    >
      <HStack mb={6} alignItems="center" gap={1}>
        <IconButton
          aria-label="Go back"
          children={<IoArrowBack />}
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
        />
        <Heading size="lg" color="gray.700">
          Add Customer Checklist
        </Heading>
      </HStack>

      <VStack gap={8} align="stretch">
        {/* Customer dropdown */}
        {!isCustomerCreationFlow && (
          <Field.Root
            id="customerSelect"
            mb={4}
            invalid={!selectedCustomerCode && customerOptions.length > 0}
          >
            <Field.Label fontWeight="semibold">
              Select Customer{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Field.Label>
            <Select.Root
              value={selectedCustomerCode ? [selectedCustomerCode] : []}
              onValueChange={(details) =>
                setSelectedCustomerCode(details.value[0])
              }
              collection={createListCollection({
                items: customerOptions,
                itemToString: (item) => item.label,
                itemToValue: (item) => item.value,
              })}
              disabled={customerOptions.length === 0}
            >
              <Select.Trigger>
                <Select.ValueText placeholder="Select an existing customer" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Positioner>
                <Select.Content>
                  {customerOptions.map((cust) => (
                    <Select.Item key={cust.value} item={cust}>
                      <Select.ItemText></Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            {!selectedCustomerCode && customerOptions.length > 0 && (
              <Field.ErrorText>Please select a customer.</Field.ErrorText>
            )}
            {customerOptions.length === 0 && (
              <Text fontSize="sm" color="fg.muted">
                No customers found. Create one first.
              </Text>
            )}
          </Field.Root>
        )}
         {isCustomerCreationFlow && customerData && (
          <Box mb={4}>
            <Text fontWeight="semibold">Customer: {customerData.airlineName} ({customerData.customerCode})</Text>
          </Box>
        )}

        <Fieldset.Root>
          <Fieldset.Legend fontWeight="semibold" mb={2}>Checklist Questions</Fieldset.Legend>
          {checklistItems.map((item) => (
            <Controller
              key={item.name}
              name={item.name as keyof ChecklistFormData}
              control={control}
              render={({ field }) => (
                <Field.Root id={item.name} mb={3}>
                  <HStack justifyContent="space-between">
                    <Field.Label htmlFor={item.name} flex="1">
                      {item.label}
                    </Field.Label>
                    <RadioGroup.Root
                      value={field.value ? "Yes" : "No"}
                      onValueChange={(details) => {
                        setValue(item.name as keyof ChecklistFormData, details.value === "Yes");
                      }}
                      orientation="horizontal"
                      gap="4"
                    >
                      <RadioGroup.Item value="Yes" id={`${item.name}-yes`}>
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>Yes</RadioGroup.ItemText>
                      </RadioGroup.Item>
                      <RadioGroup.Item value="No" id={`${item.name}-no`}>
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>No</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    </RadioGroup.Root>
                  </HStack>
                </Field.Root>
              )}
            />
          ))}
        </Fieldset.Root>

        <HStack justifyContent="space-between" mt={8}>
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!isValid || !selectedCustomerCode}>
            Next
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default AddChecklist;
