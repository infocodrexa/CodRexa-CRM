export const ROLES = {
  DEVELOPER: "developer",
  ADMIN: "admin",
  MANAGER: "manager",
  TEAM_LEADER: "team_leader",
  EXECUTIVE: "executive",
  TELEMARKETER: "telemarketer",
  BDM: "bdm",
  OFFICE_BOY: "office_boy",
  SALES_EXECUTIVE: "sales_executive",
  BDO: "bdo",
  PROJECT_INCHARGE: "project_incharge",
  PROJECT_MANAGER: "project_manager",
  BDE: "bde",
  HR_MANAGER: "hr_manager",
  USER: "user"
};

/*
rolePermissions structure:
- canCreate: array of roles that this role can create
- canDelete: array of roles this role can delete (empty means none)
- canUpdate: array or "*" for update rights
*/
export const rolePermissions = {
  developer: {
    canCreate: ["*",],
    canDelete: ["*"],
    canUpdate: ["*"]
  },
  admin: {
    canCreate: [
      "manager","team_leader","executive","telemarketer","bdm",
      "office_boy","sales_executive","bdo","project_incharge",
      "project_manager","bde","hr_manager","user"
    ],
    canDelete: [
      "manager","team_leader","executive","telemarketer","bdm",
      "office_boy","sales_executive","bdo","project_incharge",
      "project_manager","bde","hr_manager","user","property"
    ],
    canUpdate: ["*"]
  },
  manager: {
    canCreate: ["team_leader","executive","telemarketer","sales_executive","office_boy"],
    canDelete: [],
    canUpdate: ["team_leader","executive","telemarketer","sales_executive","office_boy"]
  },
  team_leader: {
    canCreate: ["executive","telemarketer"],
    canDelete: [],
    canUpdate: ["executive","telemarketer"]
  },
  executive: { canCreate: [], canDelete: [], canUpdate: [] },
  telemarketer: { canCreate: [], canDelete: [], canUpdate: [] },
  bdm: { canCreate: [], canDelete: [], canUpdate: [] },
  office_boy: { canCreate: [], canDelete: [], canUpdate: [] },
  sales_executive: { canCreate: [], canDelete: [], canUpdate: [] },
  bdo: { canCreate: [], canDelete: [], canUpdate: [] },
  project_incharge: { canCreate: [], canDelete: [], canUpdate: [] },
  project_manager: { canCreate: [], canDelete: [], canUpdate: [] },
  bde: { canCreate: [], canDelete: [], canUpdate: [] },
  hr_manager: { canCreate: [], canDelete: [], canUpdate: [] },
  user: { canCreate: [], canDelete: [], canUpdate: [] }
};
