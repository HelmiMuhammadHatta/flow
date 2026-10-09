import { MOCK_USERS, getRoleBadgeLabel } from "../src/lib/auth-mock";
import { canAccess, getNavigationForUser, isExecutiveRole } from "../src/config/navigation";

console.log("=== MEMULAI SUITE VERIFIKASI MATRIKS RBAC & AKSES CENTRO ===\n");

let allPassed = true;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ GAGAL: ${message}`);
    allPassed = false;
  }
}

// =============================================================================
// 1. PENGUJIAN 8 PERSONA (DAFTAR MODUL & ITEM)
// =============================================================================
console.log("1. Pengujian Persona: Karyawan (Bambang Wijaya)");
const employee = MOCK_USERS.find((u) => u.devPersonaKey === "employee")!;
const empMods = getNavigationForUser(employee);
assert(empMods.length === 1 && empMods[0].id === "hris", "Hanya melihat 1 modul: HRIS");
assert(empMods[0].items.some((i) => i.id === "absensi_saya"), "Memiliki item 'Absensi saya'");
assert(empMods[0].items.some((i) => i.id === "cuti_saya"), "Memiliki item 'Cuti saya'");
assert(empMods[0].items.some((i) => i.id === "profil_saya"), "Memiliki item 'Profil saya'");
assert(!empMods[0].items.some((i) => i.id === "karyawan"), "Tanpa direktori 'Karyawan'");

console.log("\n2. Pengujian Persona: HR (Maya Indah)");
const hr = MOCK_USERS.find((u) => u.devPersonaKey === "hr")!;
const hrMods = getNavigationForUser(hr);
assert(hrMods.length === 1 && hrMods[0].id === "hris", "Hanya melihat 1 modul: HRIS");
assert(hrMods[0].items.some((i) => i.id === "karyawan"), "Memiliki direktori 'Karyawan'");
assert(hrMods[0].items.some((i) => i.id === "absensi"), "Memiliki direktori 'Absensi'");
assert(hrMods[0].items.some((i) => i.id === "cuti"), "Memiliki direktori 'Cuti'");
assert(hrMods[0].items.some((i) => i.id === "profil_saya"), "Memiliki menu mandiri 'Profil saya'");

console.log("\n3. Pengujian Persona: Finance FA Region I (Rian Pratama)");
const fa = MOCK_USERS.find((u) => u.devPersonaKey === "finance_fa")!;
const faMods = getNavigationForUser(fa);
assert(faMods.length === 3, "Melihat 3 modul: HRIS, Operasional, Keuangan");
assert(faMods.some((m) => m.id === "ops" && !m.isReadOnly), "Operasional aktif dengan hak tulis");
const faFin = faMods.find((m) => m.id === "finance")!;
assert(!faFin.items.some((i) => i.id === "tutup_periode"), "Menu Keuangan TANPA Tutup Periode");

console.log("\n4. Pengujian Persona: Finance Corp (Dewi Lestari)");
const corp = MOCK_USERS.find((u) => u.devPersonaKey === "finance_corp")!;
const corpMods = getNavigationForUser(corp);
assert(corpMods.length === 3, "Melihat 3 modul: HRIS, Operasional, Keuangan");
const corpFin = corpMods.find((m) => m.id === "finance")!;
assert(corpFin.items.some((i) => i.id === "tutup_periode"), "Menu Keuangan MEMILIKI Tutup Periode");

console.log("\n5. Pengujian Persona: Admin Sistem (Ahmad Fauzi)");
const admin = MOCK_USERS.find((u) => u.devPersonaKey === "admin")!;
const adminMods = getNavigationForUser(admin);
assert(adminMods.length === 2, "Hanya melihat 2 modul: HRIS & Pengaturan");
assert(adminMods.some((m) => m.id === "settings" && m.status === "active"), "Pengaturan berstatus Aktif di MVP");
assert(!adminMods.some((m) => m.id === "ops" || m.id === "finance"), "Operasional & Keuangan TIDAK tampil");

console.log("\n6. Pengujian Persona: Super Admin (Budi Santoso)");
const superAdmin = MOCK_USERS.find((u) => u.devPersonaKey === "super_admin")!;
const superMods = getNavigationForUser(superAdmin);
assert(superMods.length === 5, "Melihat seluruh 5 modul");
assert(superMods.some((m) => m.id === "settings"), "Melihat modul Pengaturan");

// =============================================================================
// 2. PENGUJIAN KESETARAAN IDENTIK 100% MANAGER VS DIREKSI
// =============================================================================
console.log("\n7. Pengujian Kasus: Manager vs Direksi (Kesetaraan Izin Identik)");
const manager = MOCK_USERS.find((u) => u.devPersonaKey === "manager")!;
const director = MOCK_USERS.find((u) => u.devPersonaKey === "director")!;
assert(isExecutiveRole(manager.role) && isExecutiveRole(director.role), "isExecutiveRole mengidentifikasi keduanya");

const managerMods = getNavigationForUser(manager);
const directorMods = getNavigationForUser(director);

assert(managerMods.length === directorMods.length, `Jumlah modul sama: ${managerMods.length}`);
const modIdsManager = managerMods.map((m) => m.id).sort().join(",");
const modIdsDirector = directorMods.map((m) => m.id).sort().join(",");
assert(modIdsManager === modIdsDirector, `Daftar ID modul identik: ${modIdsManager}`);

const modItemsManager = managerMods.map((m) => `${m.id}:${m.isReadOnly}:${m.items.map((i) => i.id).join(",")}`).join("|");
const modItemsDirector = directorMods.map((m) => `${m.id}:${m.isReadOnly}:${m.items.map((i) => i.id).join(",")}`).join("|");
assert(modItemsManager === modItemsDirector, "Struktur item & flag isReadOnly Manager dan Direksi 100% IDENTIK");

// =============================================================================
// 3. PENGUJIAN PENJAGA RUTE (ROUTE GUARD PER PERSONA)
// =============================================================================
console.log("\n8. Pengujian Penjaga Rute (Route Guard per Persona):");

// Karyawan
assert(!canAccess(employee, "ops"), "Karyawan DITOLAK rute /operasional");
assert(!canAccess(employee, "finance"), "Karyawan DITOLAK rute /keuangan");
assert(!canAccess(employee, "executive"), "Karyawan DITOLAK rute /executive");
assert(!canAccess(employee, "settings"), "Karyawan DITOLAK rute /pengaturan");

// HR
assert(!canAccess(hr, "ops"), "HR DITOLAK rute /operasional");
assert(!canAccess(hr, "finance"), "HR DITOLAK rute /keuangan");
assert(!canAccess(hr, "settings"), "HR DITOLAK rute /pengaturan");

// Finance FA
assert(canAccess(fa, "ops"), "Finance FA DIIZINKAN rute /operasional");
assert(canAccess(fa, "finance"), "Finance FA DIIZINKAN rute /keuangan");
assert(!canAccess(fa, "settings"), "Finance FA DITOLAK rute /pengaturan");
assert(!canAccess(fa, "executive"), "Finance FA DITOLAK rute /executive");

// Admin
assert(!canAccess(admin, "ops"), "Admin DITOLAK rute /operasional");
assert(!canAccess(admin, "finance"), "Admin DITOLAK rute /keuangan");
assert(!canAccess(admin, "executive"), "Admin DITOLAK rute /executive");
assert(canAccess(admin, "settings", "manage_settings"), "Admin DIIZINKAN rute /pengaturan");

// Manager & Direksi
[manager, director].forEach((exec) => {
  assert(canAccess(exec, "ops"), `${exec.name} DIIZINKAN rute /operasional (Read-only)`);
  assert(canAccess(exec, "finance"), `${exec.name} DIIZINKAN rute /keuangan (Read-only)`);
  assert(canAccess(exec, "executive"), `${exec.name} DIIZINKAN rute /executive`);
  assert(!canAccess(exec, "settings"), `${exec.name} DITOLAK rute /pengaturan`);
  assert(!canAccess(exec, "ops", "write"), `${exec.name} DITOLAK aksi tulis Operasional`);
  assert(!canAccess(exec, "finance", "write"), `${exec.name} DITOLAK aksi tulis Keuangan`);
});

// =============================================================================
// 4. PENGUJIAN AKSI PENUTUPAN PERIODE (TUTUP PERIODE GUARD)
// =============================================================================
console.log("\n9. Pengujian Aksi Tutup Periode (/keuangan/tutup-periode):");
assert(canAccess(corp, "finance", "close_period"), "Finance Corp DIIZINKAN Tutup Periode");
assert(canAccess(superAdmin, "finance", "close_period"), "Super Admin DIIZINKAN Tutup Periode");
assert(!canAccess(fa, "finance", "close_period"), "Finance FA DITOLAK Tutup Periode (Khusus Corp & Super Admin)");
assert(!canAccess(manager, "finance", "close_period"), "Manager DITOLAK Tutup Periode");
assert(!canAccess(director, "finance", "close_period"), "Direksi DITOLAK Tutup Periode");
assert(!canAccess(admin, "finance", "close_period"), "Admin DITOLAK Tutup Periode");
assert(!canAccess(employee, "finance", "close_period"), "Karyawan DITOLAK Tutup Periode");
assert(!canAccess(hr, "finance", "close_period"), "HR DITOLAK Tutup Periode");

// =============================================================================
// 5. PENGUJIAN LABEL CAKUPAN ROLE BADGE
// =============================================================================
console.log("\n10. Pengujian Label Cakupan (Role Badge Format):");
assert(getRoleBadgeLabel("admin") === "Admin Sistem • Sistem", "Admin Sistem berlabel 'Sistem'");
assert(getRoleBadgeLabel("hr") === "HR & GA • Seluruh karyawan", "HR & GA berlabel 'Seluruh karyawan'");
assert(getRoleBadgeLabel("employee") === "Karyawan • Data pribadi", "Karyawan berlabel 'Data pribadi'");
assert(getRoleBadgeLabel("finance", "region", "finance_fa") === "Finance FA • Region I (Jawa Tengah)", "Finance FA berlabel 'Region I (Jawa Tengah)'");
assert(getRoleBadgeLabel("finance", "company", "finance_corp") === "Finance Corp • Seluruh region", "Finance Corp berlabel 'Seluruh region'");
assert(getRoleBadgeLabel("manager") === "Manajer • Seluruh region", "Manajer berlabel 'Seluruh region'");
assert(getRoleBadgeLabel("director") === "Direksi • Seluruh region", "Direksi berlabel 'Seluruh region'");
assert(getRoleBadgeLabel("super_admin") === "Super Admin • Seluruh region", "Super Admin berlabel 'Seluruh region'");

// =============================================================================
// KESIMPULAN
// =============================================================================
if (allPassed) {
  console.log("\n>>> SEMUA PENGUJIAN MATRIKS RBAC, PENJAGA RUTE, DAN AKSI LULUS 100% <<<\n");
  process.exit(0);
} else {
  console.error("\n>>> TERDAPAT PENGUJIAN YANG GAGAL <<<\n");
  process.exit(1);
}
