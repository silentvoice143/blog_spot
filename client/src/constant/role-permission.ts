import { PERMISSIONS } from "./permission";
import { ROLES } from "./roles";


export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

    [ROLES.USER]: [
        PERMISSIONS.CREATE_POST,
        PERMISSIONS.EDIT_OWN_POST,
        PERMISSIONS.DELETE_OWN_POST,
        PERMISSIONS.VIEW_POST,
    ],
};