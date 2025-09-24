// src/config/menuConfig.js
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaStickyNote,
  FaTasks,
  FaUserTie,
  FaClipboardList,
} from "react-icons/fa";

import { ROLES } from "../constants/roles";

export const menuConfig = {
  [ROLES.DEVELOPER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/users", label: "User Management", icon: <FaUsers /> },
    { to: "/dashboard/properties", label: "Properties", icon: <FaBuilding /> },
    { to: "/dashboard/notes", label: "Notes", icon: <FaStickyNote /> },
    { to: "/dashboard/tasks", label: "Dev Tools", icon: <FaTasks /> },
  ],
  [ROLES.ADMIN]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/users", label: "User Management", icon: <FaUsers /> },
    { to: "/dashboard/properties", label: "Properties", icon: <FaBuilding /> },
    { to: "/dashboard/notes", label: "Notes", icon: <FaStickyNote /> },
  ],
  [ROLES.MANAGER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/team", label: "Team Users", icon: <FaUsers /> },
    { to: "/dashboard/properties", label: "Properties", icon: <FaBuilding /> },
    { to: "/dashboard/reports", label: "Reports", icon: <FaClipboardList /> },
  ],
  [ROLES.TEAM_LEADER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/team", label: "Executives", icon: <FaUsers /> },
    { to: "/dashboard/tasks", label: "Team Tasks", icon: <FaTasks /> },
  ],
  [ROLES.EXECUTIVE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/properties", label: "Properties", icon: <FaBuilding /> },
    { to: "/dashboard/notes", label: "Notes", icon: <FaStickyNote /> },
  ],
  [ROLES.TELEMARKETER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/leads", label: "Leads", icon: <FaUsers /> },
    { to: "/dashboard/calls", label: "Call Logs", icon: <FaClipboardList /> },
  ],
  [ROLES.BDM]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/deals", label: "Business Deals", icon: <FaTasks /> },
  ],
  [ROLES.OFFICE_BOY]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/tasks", label: "Daily Tasks", icon: <FaTasks /> },
  ],
  [ROLES.SALES_EXECUTIVE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/properties", label: "Properties", icon: <FaBuilding /> },
    { to: "/dashboard/leads", label: "Leads", icon: <FaUsers /> },
  ],
  [ROLES.BDO]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/projects", label: "Projects", icon: <FaBuilding /> },
  ],
  [ROLES.PROJECT_INCHARGE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/projects", label: "Manage Projects", icon: <FaBuilding /> },
  ],
  [ROLES.PROJECT_MANAGER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/projects", label: "Project Reports", icon: <FaClipboardList /> },
  ],
  [ROLES.BDE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/leads", label: "Leads", icon: <FaUsers /> },
  ],
  [ROLES.HR_MANAGER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/employees", label: "Employees", icon: <FaUserTie /> },
    { to: "/dashboard/reports", label: "HR Reports", icon: <FaClipboardList /> },
  ],
  [ROLES.USER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/properties", label: "My Properties", icon: <FaBuilding /> },
    { to: "/dashboard/notes", label: "My Notes", icon: <FaStickyNote /> },
  ],
};
