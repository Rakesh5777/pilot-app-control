import React, { type JSX } from "react";
import { FaUsers } from "react-icons/fa";

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
];

const SideNav: React.FC = () => {
  const activePath = "/customers";

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
                activePath === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-submenu hover:bg-accent hover:text-accent-foreground"
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
