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
  Input,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useCreationStore } from "@/store/creationStore";
import {
  addChecklist,
  getChecklistQuestions,
  addChecklistQuestion,
} from "@/axios/checklistApi";
import { getCustomers } from "@/axios/customerApi";

export interface ChecklistFormData {
  id?: string;
  customerId?: string;
  customerName?: string;
  [key: string]: string | boolean | undefined; // Allow dynamic checklist question keys (q1, q2, ...)
}

export interface Checklist extends ChecklistFormData {
  id: string;
}

const AddChecklist: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    customerData,
    resetStore,
    setChecklistData,
    checklistQuestions,
    setChecklistQuestions,
  } = useCreationStore();
  const [selectedCustomerCode, setSelectedCustomerCode] = useState<
    string | undefined
  >(customerData?.customerCode);
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [addingQuestion, setAddingQuestion] = useState(false);
  const isCustomerCreationFlow = location.pathname.includes(
    "/customers/add/checklist"
  );
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    setValue,
    reset,
  } = useForm<ChecklistFormData>({
    defaultValues: {
      customerId: customerData?.customerCode || "",
      customerName: customerData?.airlineName || "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    getCustomers()
      .then((customers: { customerCode: string; airlineName: string }[]) => {
        setCustomerOptions(
          customers.map((c) => ({
            value: c.customerCode,
            label: `${c.airlineName} (${c.customerCode})`,
          }))
        );
        if (
          isCustomerCreationFlow &&
          customerData?.customerCode &&
          customers.some((c) => c.customerCode === customerData.customerCode)
        ) {
          setSelectedCustomerCode(customerData.customerCode);
          setValue("customerId", customerData.customerCode);
          setValue("customerName", customerData.airlineName);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch customers:", error);
        toaster.create({
          title: "Error",
          description: "Could not load customers.",
          type: "error",
        });
      });

    setLoadingQuestions(true);
    getChecklistQuestions()
      .then((questions) => {
        setChecklistQuestions(questions);
        setDefaultValueOfForm();
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch checklist questions:", error);
        toaster.create({
          title: "Error",
          description: "Could not load checklist questions.",
          type: "error",
        });
      })
      .finally(() => setLoadingQuestions(false));
  }, [
    customerData,
    location.pathname,
    isCustomerCreationFlow,
    setValue,
    setChecklistQuestions,
  ]);

  const onSubmit = async (data: ChecklistFormData) => {
    console.log(data);
    if (!selectedCustomerCode && !isCustomerCreationFlow) {
      toaster.create({
        title: "Error",
        description: "Please select a customer.",
        type: "error",
      });
      return;
    }

    const customerNameToSubmit =
      customerOptions
        .find((opt) => opt.value === selectedCustomerCode)
        ?.label.split(" (")[0] ||
      customerData?.airlineName ||
      "";

    const checklistPayload: ChecklistFormData = {
      ...data,
      customerId: selectedCustomerCode || customerData?.customerCode,
      customerName: customerNameToSubmit,
    };

    try {
      const savedChecklist = await addChecklist(checklistPayload); // Assuming addChecklist returns the saved checklist
      setChecklistData(savedChecklist); // Store checklist data in Zustand store

      toaster.create({
        title: "Checklist Added.",
        description: `Successfully saved checklist for ${customerNameToSubmit}.`,
        type: "success",
      });

      if (isCustomerCreationFlow) {
        resetStore(); // Reset store after full creation flow is complete
        navigate("/customers"); // Or to a success/summary page
      } else {
        navigate("/checklist"); // Navigate to the main checklist dashboard
      }
      reset(); // Reset form fields
    } catch (error) {
      console.error("Error saving checklist:", error);
      toaster.create({
        title: "Error",
        description: "Failed to save checklist. Please try again.",
        type: "error",
      });
    }
  };

  const onError = (formErrors: Record<string, unknown>) => {
    console.error("Form validation errors:", formErrors);
    toaster.create({
      title: "Validation Error.",
      description: "Please check the form for errors and try again.",
      type: "error",
    });
  };

  const handlePrevious = () => {
    if (isCustomerCreationFlow) {
      navigate("/customers/add/contact"); // Go back to AddContact in the flow
    } else {
      navigate("/checklist"); // Go back to the checklist dashboard
    }
  };

  const handleAddChecklistQuestion = async () => {
    if (!newQuestion.trim()) return;
    setAddingQuestion(true);
    try {
      const newQ = {
        id: `q${checklistQuestions.length + 1}`,
        question: newQuestion,
      };
      await addChecklistQuestion(newQ);
      setChecklistQuestions([...checklistQuestions, newQ]);
      setValue(newQ.id, false); // Set default value for new question form
      setNewQuestion("");
      setShowAddQuestion(false);
      toaster.create({
        title: "Success",
        description: "Checklist question added.",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Error",
        description: "Failed to add question.",
        type: "error",
      });
    } finally {
      setAddingQuestion(false);
    }
  };

  const setDefaultValueOfForm = () => {
    if (checklistQuestions.length > 0) {
      reset({
        customerId: customerData?.customerCode || "",
        customerName: customerData?.airlineName || "",
        ...Object.fromEntries(checklistQuestions.map((q) => [q.id, false])),
      });
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
          children={<IoArrowBack />} // Corrected: Use 'icon' prop for IconButton
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
        />
        <Heading size="lg" color="fg.default">
          Add Customer Checklist
        </Heading>
      </HStack>

      <VStack gap={6} align="stretch">
        <Field.Root
          id="customerSelect"
          mb={4}
          invalid={!selectedCustomerCode && customerOptions.length > 0}
        >
          <Field.Label fontWeight="semibold">Select Customer</Field.Label>
          <Select.Root
            value={selectedCustomerCode ? [selectedCustomerCode] : []}
            onValueChange={(details: { value: string[] }) => {
              const value = details.value[0];
              setSelectedCustomerCode(value);
              setValue("customerId", value);
              const selectedCust = customerOptions.find(
                (opt) => opt.value === value
              );
              if (selectedCust) {
                setValue("customerName", selectedCust.label.split(" (")[0]);
              } else {
                setValue("customerName", "");
              }
            }}
            collection={createListCollection({
              items: customerOptions,
              itemToString: (item: { label: string }) => item.label,
              itemToValue: (item: { value: string }) => item.value,
            })}
            disabled={customerOptions.length === 0}
            width="100%"
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
            <Text fontSize="sm" color="fg.muted" mt={1}>
              No customers found. Please create one first.
            </Text>
          )}
        </Field.Root>

        <Fieldset.Root>
          <Fieldset.Legend fontWeight="semibold" mb={3} fontSize="md">
            Checklist Questions
          </Fieldset.Legend>
          {loadingQuestions ? (
            <Text>Loading questions...</Text>
          ) : checklistQuestions.length === 0 ? (
            <Text>No checklist questions found.</Text>
          ) : (
            checklistQuestions.map((item) => (
              <Controller
                key={item.id}
                name={item.id}
                control={control}
                render={({ field }) => (
                  <Field.Root id={item.id} mb={4}>
                    <HStack
                      width={"100%"}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Field.Label
                        htmlFor={item.id}
                        flex="1"
                        mr={4}
                        fontSize="sm"
                      >
                        {item.question}
                      </Field.Label>
                      <RadioGroup.Root
                        name={field.name}
                        value={
                          field.value === true
                            ? "Yes"
                            : field.value === false
                              ? "No"
                              : "NA"
                        }
                        onValueChange={(details) => {
                          if (details.value === "Yes") field.onChange(true);
                          else if (details.value === "No")
                            field.onChange(false);
                          else field.onChange("NA");
                        }}
                      >
                        <HStack gap={4}>
                          <RadioGroup.Item value="Yes" id={`${item.id}-yes`}>
                            <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>Yes</RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value="No" id={`${item.id}-no`}>
                            <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>No</RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value="NA" id={`${item.id}-na`}>
                            <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              Not Applicable
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                        </HStack>
                      </RadioGroup.Root>
                    </HStack>
                  </Field.Root>
                )}
              />
            ))
          )}
          <Button
            mt={4}
            colorScheme="blue"
            variant="outline"
            onClick={() => setShowAddQuestion(true)}
          >
            + Add Checklist Question
          </Button>
          {showAddQuestion && (
            <VStack align="stretch" mt={4} gap={2}>
              <Field.Root>
                <Field.Label>New Question</Field.Label>
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter checklist question"
                />
              </Field.Root>
              <HStack>
                <Button
                  colorScheme="blue"
                  onClick={handleAddChecklistQuestion}
                  loading={addingQuestion}
                  disabled={!newQuestion.trim()}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddQuestion(false)}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          )}
        </Fieldset.Root>

        <HStack justifyContent="space-between" mt={8}>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
          >
            Previous
          </Button>
          <HStack gap={4}>
            {isCustomerCreationFlow && (
              <Button
                variant="ghost"
                onClick={() => {
                  resetStore();
                  navigate("/customers");
                }}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            )}
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={
                !isValid ||
                (!isCustomerCreationFlow && !selectedCustomerCode) ||
                isSubmitting
              }
            >
              {isCustomerCreationFlow
                ? "Save Checklist & Finish"
                : "Save Checklist"}
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </form>
  );
};

export default AddChecklist;
