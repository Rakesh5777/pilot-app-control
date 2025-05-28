import React, { type JSX } from "react";
import { FaUsers, FaAddressCard } from "react-icons/fa"; // Added FaAddressCard
import { useLocation } from "react-router-dom"; // Import useLocation

interface NavItem {
  name: string;
  path: string;
  icon?: JSX.Element;
}

const navItems: NavItem[] = [
  {
    name: "Customers",
    path: "/customers",
    icon: <FaUsers size={16} />,
  },
  {
    name: "Contacts",
    path: "/contacts",
    icon: <FaAddressCard size={16} />, // Added Contacts item
  },
  // Add other items from the image if needed, for example:
  // { name: "AFR Data", path: "/afr-data", icon: <FaDatabase size={16} /> },
  // { name: "Checklist", path: "/checklist", icon: <FaTasks size={16} /> },
  // { name: "Users", path: "/users", icon: <FaUsersCog size={16} /> },
  // { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt size={16} /> },
  // { name: "Trials", path: "/trials", icon: <FaFlask size={16} /> },
  // { name: "Trial Templates", path: "/trial-templates", icon: <FaFileAlt size={16} /> },
  // { name: "Profile", path: "/profile", icon: <FaUserCircle size={16} /> },
];

const SideNav: React.FC = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div className="h-screen w-64 bg-secondary flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#FBFCFC]">
          PilotApp Control Panel
        </h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${
                activePath.startsWith(item.path)
                  ? "bg-accent text-accent-foreground"
                  : "text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }
              transition-colors duration-150
            `}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;