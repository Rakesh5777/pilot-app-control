import React from 'react';

interface NavItem {
  name: string;
  path: string;
  // icon?: JSX.Element; // Placeholder for icons
}

const navItems: NavItem[] = [
  { name: "Customers", path: "/customers" },
  { name: "Contacts", path: "/contacts" },
  { name: "AFR Data", path: "/afr-data" },
  { name: "Checklist", path: "/checklist" },
];

const SideNav: React.FC = () => {
  const activePath = "/customers";

  return (
    <div className="h-screen w-64 bg-muted text-default flex flex-col">
      <div className="p-4 border-b border-[var(--bg-default)]">
        <h1 className="text-xl font-semibold color-primary text-primary">
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
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
