import { NoDataFound } from "@/components/NoDataFound";
import React from "react";

const Customers: React.FC = () => {
  const [customers] = React.useState([]);
  return (customers.length === 0 ? (<><NoDataFound title="customers" routeLink="add"/></>) : (<></>));
};

export default Customers;
