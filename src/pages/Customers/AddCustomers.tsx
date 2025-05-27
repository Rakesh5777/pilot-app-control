import React, { useState } from "react";
import {
  Button,
  Field,
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
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"; // Assuming this path is correct
import type { ValueChangeDetails as NumberInputValueChangeDetails } from "@zag-js/number-input"; // Import the specific type
import type { ValueChangeDetails as RadioGroupValueChangeDetails } from "@zag-js/radio-group"; // Import the specific type for RadioGroup

// Interface for form data remains the same
interface FormData {
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

// Interface for form errors remains the same
interface FormErrors {
  airlineName?: string;
  customerCode?: string;
  iataCode?: string;
  businessRegistrationNumber?: string;
  countryRegion?: string;
  fleetSize?: string;
  industry?: string;
  customerType?: string;
  comment?: string;
}

// Initial form state remains the same
const initialFormData: FormData = {
  airlineName: "Airline 8",
  customerCode: "",
  iataCode: "",
  businessRegistrationNumber: "",
  countryRegion: "",
  fleetSize: "",
  industry: "Airline",
  customerType: "",
  comment: "",
};

const initialFormErrors: FormErrors = {};
// Data for data-driven components (new Select and RadioGroup)
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
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialFormErrors);

  // --- Event Handlers (Updated for new component APIs) ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleIndustryChange = (details: { value: string[] }) => {
    // Select component might have different ValueChangeDetails structure
    const value = details.value[0] || "";
    setFormData((prev) => ({ ...prev, industry: value }));
    if (errors.industry) {
      setErrors((prev) => ({ ...prev, industry: undefined }));
    }
  };

  // Use the explicitly imported type for RadioGroup details
  const handleCustomerTypeChange = (details: RadioGroupValueChangeDetails) => {
    const value = details.value === null ? "" : details.value; // Handle null case
    setFormData((prev) => ({ ...prev, customerType: value }));
    if (errors.customerType) {
      setErrors((prev) => ({ ...prev, customerType: undefined }));
    }
  };

  // Use the explicitly imported type for NumberInput details
  const handleFleetSizeChange = (details: NumberInputValueChangeDetails) => {
    setFormData((prev) => ({ ...prev, fleetSize: details.value })); // Use value instead of valueAsString
    if (errors.fleetSize) {
      setErrors((prev) => ({ ...prev, fleetSize: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.airlineName.trim())
      newErrors.airlineName = "Airline Name is required.";
    if (!formData.customerCode.trim())
      newErrors.customerCode = "Customer Code is required.";
    if (!formData.iataCode.trim())
      newErrors.iataCode = "IATA Code is required.";
    if (!formData.businessRegistrationNumber.trim())
      newErrors.businessRegistrationNumber =
        "Business Registration Number is required.";
    if (!formData.countryRegion.trim())
      newErrors.countryRegion = "Country/Region of Operation is required.";
    if (!formData.fleetSize.trim()) {
      newErrors.fleetSize = "Fleet Size is required.";
    } else if (
      isNaN(parseInt(formData.fleetSize)) ||
      parseInt(formData.fleetSize) <= 0
    ) {
      newErrors.fleetSize = "Fleet Size must be a positive number.";
    }
    if (!formData.industry) newErrors.industry = "Industry is required.";
    if (!formData.customerType)
      newErrors.customerType = "Customer Type is required."; // This check might need adjustment if null is a valid "unselected" state
    if (formData.comment.length > 500)
      newErrors.comment = "Comment cannot exceed 500 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted successfully:", formData);
      toaster.create({
        title: "Customer Added.",
        description: "The new customer data has been prepared.",
        type: "success",
      });
    } else {
      console.log("Form validation failed.");
      toaster.create({
        title: "Validation Error.",
        description: "Please check the form for errors.",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors(initialFormErrors);
    toaster.create({
      description: "Form has been reset.",
      type: "info",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 900, margin: "32px 0 32px 40px", padding: 16 }}
    >
      <HStack mb={6} alignItems="center">
        <Heading size="lg" color="gray.700">
          Add Customer
        </Heading>
        {/* <Icon as={ChevronRightIcon} boxSize={6} color="gray.400" /> */}
        <Text fontSize="xl" color="gray.500">
          Basic
        </Text>
      </HStack>
      <VStack gap={6} align="stretch">
        {" "}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <Field.Root id="airlineName" invalid={!!errors.airlineName}>
              <Field.Label fontWeight="semibold">Airline Name</Field.Label>
              <Input
                name="airlineName"
                value={formData.airlineName}
                onChange={handleChange}
                borderRadius="md"
              />
              <Field.ErrorText>{errors.airlineName}</Field.ErrorText>
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root id="customerCode" invalid={!!errors.customerCode}>
              <Field.Label fontWeight="semibold">Customer Code</Field.Label>
              <Input
                name="customerCode"
                value={formData.customerCode}
                onChange={handleChange}
                borderRadius="md"
              />
              <Field.ErrorText>{errors.customerCode}</Field.ErrorText>
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root id="iataCode" invalid={!!errors.iataCode}>
              <Field.Label fontWeight="semibold">IATA Code</Field.Label>
              <Input
                name="iataCode"
                value={formData.iataCode}
                onChange={handleChange}
                textTransform="uppercase"
                borderRadius="md"
              />
              <Field.ErrorText>{errors.iataCode}</Field.ErrorText>
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
              <Input
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleChange}
                borderRadius="md"
              />
              <Field.ErrorText>
                {errors.businessRegistrationNumber}
              </Field.ErrorText>
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root id="countryRegion" invalid={!!errors.countryRegion}>
              <Field.Label fontWeight="semibold">
                Country/Region of Operation
              </Field.Label>
              <Input
                name="countryRegion"
                value={formData.countryRegion}
                onChange={handleChange}
                borderRadius="md"
              />
              <Field.ErrorText>{errors.countryRegion}</Field.ErrorText>
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root id="fleetSize" invalid={!!errors.fleetSize}>
              <Field.Label fontWeight="semibold">Fleet Size</Field.Label>
              <NumberInput.Root
                value={formData.fleetSize}
                onValueChange={handleFleetSizeChange}
                min={1}
              >
                <NumberInput.Input borderRadius="md" />
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
              </NumberInput.Root>
              <Field.ErrorText>{errors.fleetSize}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem colSpan={2}>
            <Field.Root id="industry" invalid={!!errors.industry}>
              <Field.Label fontWeight="semibold">Industry</Field.Label>
              <Select.Root
                value={[formData.industry]}
                onValueChange={handleIndustryChange}
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
              <Field.ErrorText>{errors.industry}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem colSpan={2}>
            <Field.Root id="customerType" invalid={!!errors.customerType}>
              <Field.Label as="legend" fontWeight="semibold">
                Customer Type
              </Field.Label>
              <RadioGroup.Root
                value={formData.customerType}
                onValueChange={handleCustomerTypeChange}
              >
                <HStack gap={4} wrap="wrap">
                  {customerTypeOptions.map((item) => (
                    <RadioGroup.Item key={item.value} value={item.value}>
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  ))}
                </HStack>
              </RadioGroup.Root>
              <Field.ErrorText>{errors.customerType}</Field.ErrorText>
            </Field.Root>
          </GridItem>
          <GridItem colSpan={2}>
            <Field.Root id="comment" invalid={!!errors.comment}>
              <Field.Label fontWeight="semibold">Comment</Field.Label>
              <Textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                borderRadius="md"
              />
              <Field.ErrorText>{errors.comment}</Field.ErrorText>
            </Field.Root>
          </GridItem>
        </Grid>
        <HStack justifyContent="flex-end" mt={4} gap={4}>
          <Button variant="outline" minWidth="100px" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="teal" minWidth="100px">
            Next
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default AddCustomerForm;
