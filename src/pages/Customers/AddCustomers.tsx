import React from "react";
import {
  Button,
  Field,
  Fieldset,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  NumberInput,
  RadioGroup,
  Select,
  Text,
  Textarea,
  VStack,
  createListCollection,
  Box,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useForm, Controller } from "react-hook-form";
// Removed addCustomer from here, will be handled in AddContact if needed or a combined save
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useCreationStore } from "@/store/creationStore"; // Import Zustand store
import { addCustomer } from "@/axios/customerApi";

export interface CommentItem {
  comment: string;
  time: string;
}
export interface FormData {
  // This is CustomerFormData
  id?: string; // Added for consistency if we ever fetch/edit
  airlineName: string;
  customerCode: string;
  iataCode: string;
  businessRegistrationNumber: string;
  countryRegion: string;
  fleetSize: string;
  industry: string;
  customerType: string;
  comments: CommentItem[];
}

const industryOptionsArray = [
  { value: "Airline", label: "Airline" },
  { value: "Aerospace", label: "Aerospace" },
  { value: "Logistics", label: "Logistics" },
  { value: "MRO", label: "MRO (Maintenance, Repair, Overhaul)" },
  { value: "Airport", label: "Airport Authority" },
  { value: "Other", label: "Other" },
];
const industryOptions = createListCollection({
  items: industryOptionsArray,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});

const customerTypeOptions = [
  { value: "Lead", label: "Lead" },
  { value: "Prospect", label: "Prospect" },
  { value: "Dummy Demx", label: "Dummy Demx" },
  { value: "Live Demc", label: "Live Demc" },
];

const AddCustomerForm: React.FC = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      airlineName: "",
      customerCode: "",
      iataCode: "",
      businessRegistrationNumber: "",
      countryRegion: "",
      fleetSize: "1",
      industry: "Airline",
      customerType: "Lead",
      comments: [{ comment: "", time: new Date().toISOString() }],
    },
    mode: "onTouched",
  });

  const navigate = useNavigate();
  const { setCustomerData, resetContactDataList } = useCreationStore(); // Get store actions

  // Replace onSubmit with async version that saves customer and navigates with id
  const onSubmit = async (formData: FormData) => {
    // Filter out empty comments before storing
    const filteredComments = (formData.comments || []).filter(
      (c) => c.comment && c.comment.trim() !== ""
    );
    const customerDataToStore = { ...formData, comments: filteredComments };

    try {
      // Save customer to backend
      const savedCustomer = await addCustomer(customerDataToStore);
      setCustomerData(savedCustomer); // Store full customer data (with id/code)
      resetContactDataList(); // Reset any previous contact list
      toaster.create({
        title: "Customer Saved",
        description: "Proceed to add contacts.",
        type: "success",
      });
      // Navigate to AddContact with customer id as param
      navigate(
        `/customers/add/contact?customerId=${savedCustomer.customerCode}`
      );
    } catch {
      toaster.create({
        title: "Error",
        description: "Failed to save customer.",
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

  const handleCancel = () => {
    reset();
    useCreationStore.getState().resetStore(); // Clear store on cancel
    toaster.create({
      description: "Form has been reset.",
      type: "info",
    });
    navigate("/customers");
  };

  const comments = watch("comments");

  const addCommentField = () => {
    const current = getValues("comments") || [];
    setValue("comments", [
      ...current,
      { comment: "", time: new Date().toISOString() },
    ]);
  };

  const removeCommentField = (idx: number) => {
    const current = getValues("comments") || [];
    setValue(
      "comments",
      current.filter((_, i) => i !== idx)
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      style={{ maxWidth: 900, margin: "8px 0 8px 16px", padding: 16 }}
    >
      <HStack mb={6} alignItems="center" gap={0}>
        <Button
          padding={0}
          variant="plain"
          size="sm"
          onClick={() => {
            useCreationStore.getState().resetStore();
            navigate(-1);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <IoArrowBack />
        </Button>
        <Heading size="lg" color="gray.700">
          Add Customer
        </Heading>
      </HStack>
      <VStack gap={6} align="stretch">
        {/* Customer Form Fields (Grid) - No change to this section, keeping it as is from your file */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <Field.Root id="airlineName" invalid={!!errors.airlineName}>
              <Field.Label fontWeight="semibold">
                Airline Name{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Field.Label>
              <Controller
                name="airlineName"
                control={control}
                rules={{ required: "Airline Name is required." }}
                render={({ field }) => <Input {...field} borderRadius="md" />}
              />
              <Field.ErrorText>{errors.airlineName?.message}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root id="customerCode" invalid={!!errors.customerCode}>
              <Field.Label fontWeight="semibold">
                Customer Code{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Field.Label>
              <Controller
                name="customerCode"
                control={control}
                rules={{ required: "Customer Code is required." }}
                render={({ field }) => <Input {...field} borderRadius="md" />}
              />
              <Field.ErrorText>{errors.customerCode?.message}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root id="iataCode" invalid={!!errors.iataCode}>
              <Field.Label fontWeight="semibold">IATA Code</Field.Label>
              <Controller
                name="iataCode"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Input
                    {...field}
                    textTransform="uppercase"
                    borderRadius="md"
                  />
                )}
              />
              <Field.ErrorText>{errors.iataCode?.message}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root
              id="businessRegNum"
              invalid={!!errors.businessRegistrationNumber}
            >
              <Field.Label fontWeight="semibold">
                Business Registration Number
              </Field.Label>
              <Controller
                name="businessRegistrationNumber"
                control={control}
                rules={{ required: false }}
                render={({ field }) => <Input {...field} borderRadius="md" />}
              />
              <Field.ErrorText>
                {errors.businessRegistrationNumber?.message}
              </Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root id="countryRegion" invalid={!!errors.countryRegion}>
              <Field.Label fontWeight="semibold">
                Country/Region of Operation
              </Field.Label>
              <Controller
                name="countryRegion"
                control={control}
                rules={{ required: false }}
                render={({ field }) => <Input {...field} borderRadius="md" />}
              />
              <Field.ErrorText>{errors.countryRegion?.message}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root id="fleetSize" invalid={!!errors.fleetSize}>
              <Field.Label fontWeight="semibold">Fleet Size</Field.Label>
              <Controller
                name="fleetSize"
                control={control}
                rules={{ required: false, validate: undefined }}
                render={({ field }) => (
                  <NumberInput.Root
                    value={field.value}
                    onValueChange={(details) => field.onChange(details.value)}
                    min={1}
                  >
                    <NumberInput.Input borderRadius="md" />
                    <NumberInput.Control>
                      <NumberInput.IncrementTrigger />
                      <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                  </NumberInput.Root>
                )}
              />
              <Field.ErrorText>{errors.fleetSize?.message}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Field.Root id="industry" invalid={!!errors.industry}>
              <Field.Label fontWeight="semibold">Industry</Field.Label>
              <Controller
                name="industry"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select.Root
                    value={[field.value]}
                    onValueChange={(details) =>
                      field.onChange(details.value[0] || "")
                    }
                    collection={industryOptions}
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select industry" />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Positioner>
                      <Select.Content>
                        {industryOptionsArray.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                )}
              />
              <Field.ErrorText>{errors.industry?.message}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Fieldset.Root invalid={!!errors.customerType}>
              <Fieldset.Legend>
                Customer Type{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Fieldset.Legend>
              <Controller
                name="customerType"
                control={control}
                rules={{ required: "Customer Type is required." }}
                render={({ field }) => (
                  <RadioGroup.Root
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                  >
                    <HStack gap={4} wrap="wrap">
                      {customerTypeOptions.map((item) => (
                        <RadioGroup.Item key={item.value} value={item.value}>
                          <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                          <RadioGroup.ItemIndicator />
                          <RadioGroup.ItemText>
                            {item.label}
                          </RadioGroup.ItemText>
                        </RadioGroup.Item>
                      ))}
                    </HStack>
                  </RadioGroup.Root>
                )}
              />
              <Fieldset.ErrorText>
                {errors.customerType?.message}
              </Fieldset.ErrorText>
            </Fieldset.Root>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Field.Root id="comments" invalid={!!errors.comments}>
              <Field.Label fontWeight="semibold">Comments</Field.Label>
              <Box maxH="180px" overflowY="auto" width="100%" pr={3}>
                <VStack align="stretch" gap={2} width="100%">
                  {comments && comments.length > 0 ? (
                    comments.map((item, idx) => (
                      <HStack key={idx} align="start" gap={2} width="100%">
                        <Controller
                          name={`comments.${idx}.comment` as const}
                          control={control}
                          rules={{
                            maxLength: {
                              value: 500,
                              message: "Comment cannot exceed 500 characters.",
                            },
                          }}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              rows={3}
                              borderRadius="md"
                              placeholder="Enter comment..."
                              width="100%"
                              minW={0}
                              resize="vertical"
                            />
                          )}
                        />
                        <Text fontSize="xs" color="gray.500" minW="120px">
                          {item.time
                            ? new Date(item.time).toLocaleString()
                            : ""}
                        </Text>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => removeCommentField(idx)}
                          isDisabled={
                            comments.length <= 1 &&
                            idx === 0 &&
                            !comments[idx].comment
                          } // Disable if it's the only empty comment
                        >
                          Remove
                        </Button>
                      </HStack>
                    ))
                  ) : (
                    <Text color="gray.400" fontSize="sm">
                      No comments yet.
                    </Text>
                  )}
                </VStack>
              </Box>
              <Button
                size="sm"
                onClick={addCommentField}
                variant="outline"
                alignSelf="start"
                mt={2}
              >
                Add Comment
              </Button>
              <Field.ErrorText>
                {Array.isArray(errors.comments)
                  ? errors.comments.find((e) => e)?.message
                  : errors.comments?.message}
              </Field.ErrorText>
            </Field.Root>
          </GridItem>
        </Grid>
        <HStack justifyContent="flex-end" mt={4} gap={4}>
          <Button
            variant="outline"
            minWidth="100px"
            onClick={handleCancel}
            type="button"
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" minWidth="100px" isLoading={isSubmitting}>
            Save & Next
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default AddCustomerForm;
