export const ROLES = {
    ADMIN: 'admin',
    OWNER: 'owner',
    USER: 'user',
  };
  
  export const hasRole = (userRole: string, allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };
  