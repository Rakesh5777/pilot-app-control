import React from "react";
import ContactDashboard from "./ContactDashboard";
import { NoDataFound } from "@/components/NoDataFound";
import { getContacts } from "@/axios/contactApi";
import type { Contact } from "./AddContact";
import { Box } from "@chakra-ui/react";

const Contacts: React.FC = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getContacts()
      .then((data) => setContacts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading && contacts.length === 0) return <Box p={4}>Loading contacts...</Box>;

  if (!loading && contacts.length === 0) {
    return <NoDataFound title="contacts" routeLink="add" />;
  }

  return <ContactDashboard contacts={contacts} loading={loading} />;
};

export default Contacts;