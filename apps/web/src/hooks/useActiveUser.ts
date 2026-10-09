"use client";

import { useMemo, useCallback, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import {
  MOCK_USERS,
  subscribeAuth,
  getActiveUserSnapshot,
  getServerActiveUserSnapshot,
  saveActiveUser,
} from "@/lib/auth-mock";
import type { MockUser } from "@/types/auth";

/**
 * Hook untuk mengelola state pengguna aktif secara reaktif dan aman dari hydration mismatch.
 * - Menggunakan `useSyncExternalStore` dengan `getServerActiveUserSnapshot` untuk menjamin render SSR dan initial client hydration selalu identik (Super Admin).
 * - Begitu client mount, React menyelaraskan store dengan nilai snapshot client (dari localStorage) tanpa cascading render warning atau hydration mismatch.
 * - Jika URL memiliki query param (?role=...), persona dari URL diprioritaskan untuk kebutuhan testing/dev.
 */
export function useActiveUser() {
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role");

  // Cari persona dev dari query string jika ada (?role=finance_corp, ?role=manager, dll)
  const roleFromQuery = useMemo(() => {
    if (!queryRole) return null;
    const lower = queryRole.toLowerCase();
    return (
      MOCK_USERS.find(
        (u) =>
          u.devPersonaKey === lower ||
          u.role === lower ||
          (lower === "direksi" && u.role === "director") ||
          (lower === "karyawan" && u.role === "employee") ||
          (lower === "manajer" && u.role === "manager")
      ) ?? null
    );
  }, [queryRole]);

  // Subscribe ke external store dengan safe hydration via getServerActiveUserSnapshot
  const storeUser = useSyncExternalStore(
    subscribeAuth,
    getActiveUserSnapshot,
    getServerActiveUserSnapshot
  );

  const activeUser = roleFromQuery ?? storeUser;

  const handleUserChange = useCallback((newUser: MockUser) => {
    saveActiveUser(newUser);
  }, []);

  return {
    activeUser,
    handleUserChange,
    roleFromQuery,
  };
}
