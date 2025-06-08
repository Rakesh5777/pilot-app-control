import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  Fieldset,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  RadioGroup,
  Select,
  Text,
  VStack,
  createListCollection,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IoArrowBack,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useCreationStore } from "@/store/creationStore";
import { addContact } from "@/axios/contactApi";
import { getCustomers } from "@/axios/customerApi";

export interface PhoneNumber {
  type: string;
  number: string;
}

export interface ContactFormData {
  id?: string;
  customerId?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  isPrimary: boolean;
  phoneNumbers: PhoneNumber[];
}

export interface Contact extends ContactFormData {
  id: string;
}

const phoneTypeOptionsArray = [
  { value: "Work", label: "Work" },
  { value: "Mobile", label: "Mobile" },
  { value: "Home", label: "Home" },
  { value: "Other", label: "Other" },
];

const phoneTypeOptions = createListCollection({
  items: phoneTypeOptionsArray,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});

// Helper function to safely get error message
function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error && "message" in error) {
    return (error as { message?: string }).message;
  }
  return undefined;
}

const AddContact: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerData } = useCreationStore();
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
  } = useForm<{ contacts: ContactFormData[] }>({
    defaultValues: {
      contacts: [
        {
          firstName: "",
          lastName: "",
          emailAddress: "",
          isPrimary: false,
          phoneNumbers: [{ type: "Work", number: "" }],
        },
      ],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const isCustomerCreationFlow = location.pathname.includes(
    "/customers/add/contact"
  );

  const onSubmit = async (data: { contacts: ContactFormData[] }) => {
    try {
      if (!selectedCustomerCode) {
        toaster.create({
          title: "Error",
          description: "Customer Code is missing.",
          type: "error",
        });
        return;
      }
      for (const contact of data.contacts) {
        await addContact({
          ...contact,
          customerId: selectedCustomerCode,
          // @ts-expect-error: allow customerName for backend display
          customerName:
            customerOptions
              .find((opt) => opt.value === selectedCustomerCode)
              ?.label?.split(" (")[0] || "",
        });
      }
      toaster.create({
        title: `Contact(s) Added.`,
        description: `Successfully saved ${data.contacts.length} contact(s) for the customer.`,
        type: "success",
      });
      // resetStore(); // Reset store only at the end of the entire flow
      if (isCustomerCreationFlow) {
        navigate("/customers/add/afrdata");
      } else {
        navigate("/contacts");
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
      navigate("/customers/add"); // Navigate to Add Customer page
    } else {
      navigate("/contacts"); // Navigate to Contacts dashboard
    }
  };

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
          Add Contact
        </Heading>
      </HStack>

      <VStack gap={8} align="stretch">
        {/* Customer dropdown */}
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
                    <Select.ItemText>{cust.label}</Select.ItemText>
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

        {fields.map((item, idx) => (
          <Box
            key={item.id}
            borderWidth={1}
            borderRadius="md"
            p={4}
            mb={2}
            position="relative"
          >
            {/* Trash icon for delete contact */}
            {fields.length > 1 && (
              <IconButton
                aria-label="Delete contact"
                children={<IoTrashOutline style={{ color: "#e53e3e" }} />}
                variant="ghost"
                position="absolute"
                top={2}
                right={2}
                zIndex={2}
                size="sm"
                onClick={() => remove(idx)}
                _hover={{
                  bg: "red.50",
                  color: "red.600",
                  transform: "scale(1.1)",
                  boxShadow: "md",
                }}
              />
            )}
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <Field.Root
                  id={`contacts.${idx}.firstName`}
                  invalid={!!errors.contacts?.[idx]?.firstName}
                >
                  <Field.Label fontWeight="semibold">
                    First Name{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Field.Label>
                  <Controller
                    name={`contacts.${idx}.firstName`}
                    control={control}
                    rules={{ required: "First Name is required." }}
                    render={({ field }) => (
                      <Input {...field} borderRadius="md" />
                    )}
                  />
                  {errors.contacts?.[idx]?.firstName && (
                    <Field.ErrorText>
                      {getErrorMessage(errors.contacts[idx]?.firstName)}
                    </Field.ErrorText>
                  )}
                </Field.Root>
              </GridItem>
              <GridItem>
                <Field.Root
                  id={`contacts.${idx}.lastName`}
                  invalid={!!errors.contacts?.[idx]?.lastName}
                >
                  <Field.Label fontWeight="semibold">
                    Last Name{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Field.Label>
                  <Controller
                    name={`contacts.${idx}.lastName`}
                    control={control}
                    rules={{ required: "Last Name is required." }}
                    render={({ field }) => (
                      <Input {...field} borderRadius="md" />
                    )}
                  />
                  {errors.contacts?.[idx]?.lastName && (
                    <Field.ErrorText>
                      {getErrorMessage(errors.contacts[idx]?.lastName)}
                    </Field.ErrorText>
                  )}
                </Field.Root>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Field.Root
                  id={`contacts.${idx}.emailAddress`}
                  invalid={!!errors.contacts?.[idx]?.emailAddress}
                >
                  <Field.Label fontWeight="semibold">
                    Email Address{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Field.Label>
                  <Controller
                    name={`contacts.${idx}.emailAddress`}
                    control={control}
                    rules={{
                      required: "Email is required.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <Input type="email" {...field} borderRadius="md" />
                    )}
                  />
                  {errors.contacts?.[idx]?.emailAddress && (
                    <Field.ErrorText>
                      {getErrorMessage(errors.contacts[idx]?.emailAddress)}
                    </Field.ErrorText>
                  )}
                </Field.Root>
              </GridItem>
              <GridItem>
                <Fieldset.Root
                  id={`contacts.${idx}.isPrimary`}
                  invalid={!!errors.contacts?.[idx]?.isPrimary}
                >
                  <Fieldset.Legend>
                    Is Primary Contact?{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Fieldset.Legend>
                  <Controller
                    name={`contacts.${idx}.isPrimary`}
                    control={control}
                    rules={{
                      validate: (value) =>
                        value === true ||
                        value === false ||
                        "Please specify if this is a primary contact.",
                    }}
                    render={({ field }) => (
                      <RadioGroup.Root
                        value={field.value ? "yes" : "no"}
                        onValueChange={({ value }) =>
                          field.onChange(value === "yes")
                        }
                      >
                        <HStack gap={4}>
                          <RadioGroup.Item value="yes">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>Yes</RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value="no">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>No</RadioGroup.ItemText>
                          </RadioGroup.Item>
                        </HStack>
                      </RadioGroup.Root>
                    )}
                  />
                  {errors.contacts?.[idx]?.isPrimary && (
                    <Fieldset.ErrorText>
                      {getErrorMessage(errors.contacts[idx]?.isPrimary)}
                    </Fieldset.ErrorText>
                  )}
                </Fieldset.Root>
              </GridItem>
            </Grid>
            {/* Phone Numbers */}
            <VStack align="stretch" gap={3} mt={4}>
              <Heading size="sm" color="gray.600">
                Phone Numbers
              </Heading>
              <Controller
                name={`contacts.${idx}.phoneNumbers`}
                control={control}
                render={({ field }) => (
                  <>
                    {field.value.map((phone: PhoneNumber, pIdx: number) => (
                      <HStack key={pIdx} gap={2} alignItems="flex-end">
                        <Box flex={1}>
                          <Field.Root
                            id={`contacts.${idx}.phoneNumbers.${pIdx}.type`}
                            invalid={
                              !!errors.contacts?.[idx]?.phoneNumbers?.[pIdx]
                                ?.type
                            }
                          >
                            <Field.Label srOnly>Phone Type</Field.Label>
                            <Controller
                              name={`contacts.${idx}.phoneNumbers.${pIdx}.type`}
                              control={control}
                              rules={{ required: "Type is required" }}
                              render={({ field: phoneTypeField }) => (
                                <Select.Root
                                  value={[phoneTypeField.value]}
                                  onValueChange={(details) =>
                                    phoneTypeField.onChange(
                                      details.value[0] || ""
                                    )
                                  }
                                  collection={phoneTypeOptions}
                                >
                                  <Select.Trigger borderRadius="md">
                                    <Select.ValueText placeholder="Select type" />
                                  </Select.Trigger>
                                  <Select.Positioner>
                                    <Select.Content>
                                      {phoneTypeOptionsArray.map((opt) => (
                                        <Select.Item key={opt.value} item={opt}>
                                          <Select.ItemText>
                                            {opt.label}
                                          </Select.ItemText>
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Positioner>
                                </Select.Root>
                              )}
                            />
                            {errors.contacts?.[idx]?.phoneNumbers?.[pIdx]
                              ?.type && (
                              <Field.ErrorText>
                                {getErrorMessage(
                                  errors.contacts[idx]?.phoneNumbers?.[pIdx]
                                    ?.type
                                )}
                              </Field.ErrorText>
                            )}
                          </Field.Root>
                        </Box>
                        <Box flex={2}>
                          <Field.Root
                            id={`contacts.${idx}.phoneNumbers.${pIdx}.number`}
                            invalid={
                              !!errors.contacts?.[idx]?.phoneNumbers?.[pIdx]
                                ?.number
                            }
                          >
                            <Field.Label srOnly>Phone Number</Field.Label>
                            <Controller
                              name={`contacts.${idx}.phoneNumbers.${pIdx}.number`}
                              control={control}
                              rules={{ required: "Number is required" }}
                              render={({ field: phoneNumField }) => (
                                <Input
                                  {...phoneNumField}
                                  placeholder="Phone Number"
                                  borderRadius="md"
                                />
                              )}
                            />
                          </Field.Root>
                        </Box>
                        <IconButton
                          aria-label="Remove phone number"
                          children={<IoRemoveCircleOutline />}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => {
                            const newPhones = [...field.value];
                            newPhones.splice(pIdx, 1);
                            field.onChange(newPhones);
                          }}
                          disabled={field.value.length <= 1}
                        />
                      </HStack>
                    ))}
                    <Button
                      onClick={() =>
                        field.onChange([
                          ...field.value,
                          { type: "Work", number: "" },
                        ])
                      }
                      variant="outline"
                      size="sm"
                      alignSelf="flex-start"
                    >
                      <IoAddCircleOutline style={{ marginRight: 4 }} />
                      Add Phone Number
                    </Button>
                  </>
                )}
              />
            </VStack>
          </Box>
        ))}
        <Button
          onClick={() =>
            append({
              firstName: "",
              lastName: "",
              emailAddress: "",
              isPrimary: false,
              phoneNumbers: [{ type: "Work", number: "" }],
            })
          }
          variant="outline"
          alignSelf="flex-end"
        >
          Add Contact
        </Button>
        <HStack justifyContent="space-between" mt={8}>
          {isCustomerCreationFlow ? (
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          ) : (
            <span />
          )}
          <HStack gap={4}>
            {isCustomerCreationFlow && (
              <Button
                variant="outline"
                minWidth="100px"
                onClick={() => navigate("/customers/add/afrdata")}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            )}
            <Button
              minWidth="150px"
              type="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            >
              {isCustomerCreationFlow ? "Save & Next" : "Save Contact"}
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </form>
  );
};

export default AddContact;
