import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  VStack,
  IconButton,
  Box,
  RadioGroup,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { addAFRData } from "@/axios/afrDataApi";
import { getCustomers } from "@/axios/customerApi";


export interface AFRDataType {
  id?: string;
  flightsTotal: string;
  organization: string;
  flightsWithAFR: string;
  flightsWithCaptainCode: string;
  percentageWithCaptainCode: string;
  pilotAppSuitable: boolean;
}

export interface AFRData extends AFRDataType {
  id: string;
}

const AddAFRData: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCustomerCreationFlow = location.pathname.includes("/customers/add/afrdata");
  const [customerOptions, setCustomerOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  useEffect(() => {
    getCustomers().then((customers: { customerCode: string; airlineName: string }[]) => {
      setCustomerOptions(
        customers.map((c) => ({
          value: c.customerCode,
          label: `${c.airlineName} (${c.customerCode})`,
        }))
      );
      // If in customer creation flow and customerData exists, pre-select it
      if (isCustomerCreationFlow && customers.length > 0) {
        setSelectedCustomerId(customers[0].customerCode);
      }
    });
  }, [isCustomerCreationFlow]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AFRDataType>({
    defaultValues: {
      flightsTotal: "",
      organization: "",
      flightsWithAFR: "",
      flightsWithCaptainCode: "",
      percentageWithCaptainCode: "",
      pilotAppSuitable: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: AFRDataType) => {
    try {
      const afrDataWithCustomer = { ...data, customerId: selectedCustomerId };
      await addAFRData(afrDataWithCustomer);
      toaster.create({
        title: "AFR Data Added.",
        description: "Successfully saved AFR data.",
        type: "success",
      });
      if (isCustomerCreationFlow) {
        navigate("/customers/add/checklist");
      } else {
        navigate("/afrdata");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toaster.create({
        title: "Error",
        description: "Failed to save AFR data.",
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
      navigate("/customers/add/contacts");
    } else {
      navigate("/afrdata");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      style={{ maxWidth: 1200, margin: "8px auto", padding: 16 }}
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
          Create AFR Data
        </Heading>
      </HStack>

      <VStack gap={8} align="stretch">
        {/* Customer dropdown */}
        <Field.Root
          id="customerSelect"
          mb={4}
          invalid={!selectedCustomerId && customerOptions.length > 0}
        >
          <Field.Label fontWeight="semibold">
            Select Customer
          </Field.Label>
          <Select.Root
            value={selectedCustomerId ? [selectedCustomerId] : []}
            onValueChange={(details: { value: string[] }) => setSelectedCustomerId(details.value[0])}
            collection={createListCollection({
              items: customerOptions,
              itemToString: (item: { label: string }) => item.label,
              itemToValue: (item: { value: string }) => item.value,
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
                    <Select.ItemText>{cust.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
          {!selectedCustomerId && customerOptions.length > 0 && (
            <Field.ErrorText>Please select a customer.</Field.ErrorText>
          )}
          {customerOptions.length === 0 && (
            <Box color="gray.500" fontSize="sm" mt={1}>
              No customers found. Create one first.
            </Box>
          )}
        </Field.Root>

        <Box borderWidth={1} borderRadius="md" p={4} mb={2}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={10}>
            <GridItem>
              <Field.Root id="flightsTotal" invalid={!!errors.flightsTotal}>
                <Field.Label fontWeight="semibold">
                  Flights Total
                </Field.Label>
                <Controller
                  name="flightsTotal"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} borderRadius="md" />
                  )}
                />
                {errors.flightsTotal && (
                  <Field.ErrorText>{errors.flightsTotal.message}</Field.ErrorText>
                )}
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root id="organization" invalid={!!errors.organization}>
                <Field.Label fontWeight="semibold">
                  Organization
                </Field.Label>
                <Controller
                  name="organization"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} borderRadius="md" />
                  )}
                />
                {errors.organization && (
                  <Field.ErrorText>{errors.organization.message}</Field.ErrorText>
                )}
              </Field.Root>
            </GridItem>

            <GridItem>
              <Field.Root id="flightsWithAFR" invalid={!!errors.flightsWithAFR}>
                <Field.Label fontWeight="semibold">
                  Flights With AFR
                </Field.Label>
                <Controller
                  name="flightsWithAFR"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} borderRadius="md" />
                  )}
                />
                {errors.flightsWithAFR && (
                  <Field.ErrorText>{errors.flightsWithAFR.message}</Field.ErrorText>
                )}
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root id="flightsWithCaptainCode" invalid={!!errors.flightsWithCaptainCode}>
                <Field.Label fontWeight="semibold">
                  Flights With Captain Code
                </Field.Label>
                <Controller
                  name="flightsWithCaptainCode"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} borderRadius="md" />
                  )}
                />
                {errors.flightsWithCaptainCode && (
                  <Field.ErrorText>{errors.flightsWithCaptainCode.message}</Field.ErrorText>
                )}
              </Field.Root>
            </GridItem>

            <GridItem>
              <Field.Root id="percentageWithCaptainCode" invalid={!!errors.percentageWithCaptainCode}>
                <Field.Label fontWeight="semibold">
                  Percentage With Captain Code
                </Field.Label>
                <Controller
                  name="percentageWithCaptainCode"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} borderRadius="md" />
                  )}
                />
                {errors.percentageWithCaptainCode && (
                  <Field.ErrorText>{errors.percentageWithCaptainCode.message}</Field.ErrorText>
                )}
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root id="pilotAppSuitable" invalid={!!errors.pilotAppSuitable}>
                <Field.Label fontWeight="semibold">
                  Pilot App Suitable
                </Field.Label>
                <Controller
                  name="pilotAppSuitable"
                  control={control}
                  render={({ field }) => {
                    const pilotAppOptions = [
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ];
                    return (
                      <RadioGroup.Root
                        name={field.name}
                        value={field.value === true ? "true" : "false"}
                        onValueChange={({ value }) => field.onChange(value === "true")}
                      >
                        <HStack gap={4} wrap="wrap" mt={2}>
                          {pilotAppOptions.map((item) => (
                            <RadioGroup.Item key={item.value} value={item.value}>
                              <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </HStack>
                      </RadioGroup.Root>
                    );
                  }}
                />
              </Field.Root>
            </GridItem>
          </Grid>
        </Box>

        <HStack justifyContent="space-between" gap={10} mt={4}>
          {isCustomerCreationFlow ? (
            <Button variant="outline" onClick={handlePrevious} minW={32}>
              Previous
            </Button>
          ) : <span />}
          <HStack gap={4}>
            {isCustomerCreationFlow && (
              <Button
                variant="outline"
                minW={32}
                onClick={() => navigate("/customers/add/checklist")}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            )}
            <Button
              type="submit"
              colorScheme="teal"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              minW={32}
            >
              {isCustomerCreationFlow ? "Save & Next" : "Submit"}
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </form>
  );
};

export default AddAFRData;
