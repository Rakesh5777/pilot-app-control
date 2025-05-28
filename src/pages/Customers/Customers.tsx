import React from "react";
import CustomerDashboard from "./CustomerDashboard";
import { NoDataFound } from "@/components/NoDataFound";
import { getCustomers } from "@/axios/customerApi";

// Copy FormData type here for local use
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

const Customers: React.FC = () => {
  const [customers, setCustomers] = React.useState<FormData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getCustomers()
      .then((data) => setCustomers(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading && customers.length === 0) return <div>Loading...</div>;

  if (customers.length === 0) {
    return <NoDataFound title="customers" routeLink="add" />;
  }

  return <CustomerDashboard customers={customers} loading={loading} />;
};

export default Customers;
