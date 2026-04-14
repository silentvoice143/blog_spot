import { useMemo } from "react";
import { ROLE_PERMISSIONS } from "@/constant/role-permission";
import { useStore } from "@/store";

export const usePermission = () => {
    const { user } = useStore();

    const permissions = useMemo(() => {
        if (!user?.role) return [];
        return ROLE_PERMISSIONS[user.role] || [];
    }, [user?.role]);

    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };

    return {
        hasPermission,
        permissions,
        role: user?.role,
    };
};