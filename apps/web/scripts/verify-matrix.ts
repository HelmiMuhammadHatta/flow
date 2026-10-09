import { MOCK_USERS } from "../src/lib/auth-mock";
import { canAccess, getNavigationForUser } from "../src/config/navigation";

console.log("=== MEMULAI VERIFIKASI MATRIKS RBAC 8 PERSONA CENTRO ===\n");

let allPassed = true;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ GAGAL: ${message}`);
    allPassed = false;
  }
}

// 1. Karyawan
console.log("1. Pengujian Persona: Karyawan (Bambang Wijaya)");
const employee = MOCK_USERS.find((u) => u.devPersonaKey === "employee")!;
const empMods = getNavigationForUser(employee);
assert(empMods.length === 1 && empMods[0].id === "hris", "Hanya melihat 1 modul: HRIS");
assert(empMods[0].items.some((i) => i.id === "absensi_saya"), "Memiliki item 'Absensi saya'");
assert(empMods[0].items.some((i) => i.id === "cuti_saya"), "Memiliki item 'Cuti saya'");
assert(empMods[0].items.some((i) => i.id === "profil_saya"), "Memiliki item 'Profil saya'");
assert(!canAccess(employee, "ops"), "Ditolak akses Operasional");
assert(!canAccess(employee, "finance"), "Ditolak akses Keuangan");
assert(!canAccess(employee, "settings"), "Ditolak akses Pengaturan");

// 2. HR
console.log("\n2. Pengujian Persona: HR (Maya Indah)");
const hr = MOCK_USERS.find((u) => u.devPersonaKey === "hr")!;
const hrMods = getNavigationForUser(hr);
assert(hrMods.length === 1 && hrMods[0].id === "hris", "Hanya melihat 1 modul: HRIS");
assert(hrMods[0].items.some((i) => i.id === "karyawan"), "Memiliki item direktori 'Karyawan'");
assert(hrMods[0].items.some((i) => i.id === "absensi"), "Memiliki item 'Absensi'");
assert(hrMods[0].items.some((i) => i.id === "cuti"), "Memiliki item 'Cuti'");
assert(hrMods[0].items.some((i) => i.id === "profil_saya"), "Memiliki menu mandiri 'Profil saya'");
assert(!canAccess(hr, "ops"), "Ditolak akses Operasional");
assert(!canAccess(hr, "finance"), "Ditolak akses Keuangan");

// 3. Finance FA Region I
console.log("\n3. Pengujian Persona: Finance FA Region I (Rian Pratama)");
const fa = MOCK_USERS.find((u) => u.devPersonaKey === "finance_fa")!;
const faMods = getNavigationForUser(fa);
assert(faMods.some((m) => m.id === "ops"), "Melihat modul Operasional");
assert(faMods.some((m) => m.id === "finance"), "Melihat modul Keuangan");
const faFin = faMods.find((m) => m.id === "finance")!;
assert(!faFin.items.some((i) => i.id === "tutup_periode"), "TANPA Tutup periode di menu Keuangan");
assert(!canAccess(fa, "finance", "close_period"), "canAccess menolak aksi close_period untuk FA");
assert(!canAccess(fa, "settings"), "Ditolak akses Pengaturan");

// 4. Finance Corp
console.log("\n4. Pengujian Persona: Finance Corp (Dewi Lestari)");
const corp = MOCK_USERS.find((u) => u.devPersonaKey === "finance_corp")!;
const corpMods = getNavigationForUser(corp);
assert(corpMods.some((m) => m.id === "ops"), "Melihat modul Operasional");
const corpFin = corpMods.find((m) => m.id === "finance")!;
assert(corpFin.items.some((i) => i.id === "tutup_periode"), "MEMILIKI Tutup periode di menu Keuangan");
assert(canAccess(corp, "finance", "close_period"), "canAccess mengizinkan close_period untuk Finance Corp");
assert(!canAccess(corp, "settings"), "Ditolak akses Pengaturan");

// 5. Manager & Direksi
console.log("\n5. Pengujian Persona: Manager & Direksi");
const manager = MOCK_USERS.find((u) => u.devPersonaKey === "manager")!;
const director = MOCK_USERS.find((u) => u.devPersonaKey === "director")!;
[manager, director].forEach((user) => {
  const mods = getNavigationForUser(user);
  assert(mods.some((m) => m.id === "ops" && m.isReadOnly), `${user.name} Operasional dalam mode Hanya Lihat`);
  assert(mods.some((m) => m.id === "finance" && m.isReadOnly), `${user.name} Keuangan dalam mode Hanya Lihat`);
  assert(mods.some((m) => m.id === "executive"), `${user.name} Melihat Dashboard eksekutif`);
  assert(!canAccess(user, "ops", "write"), `${user.name} Ditolak aksi tulis Operasional`);
  assert(!canAccess(user, "finance", "write"), `${user.name} Ditolak aksi tulis Keuangan`);
  assert(!canAccess(user, "settings"), `${user.name} Ditolak akses Pengaturan`);
});

// 6. Admin Sistem
console.log("\n6. Pengujian Persona: Admin Sistem (Ahmad Fauzi)");
const admin = MOCK_USERS.find((u) => u.devPersonaKey === "admin")!;
const adminMods = getNavigationForUser(admin);
assert(adminMods.some((m) => m.id === "settings" && m.status === "active"), "Melihat modul Pengaturan berstatus Aktif di MVP");
assert(!canAccess(admin, "ops"), "Admin TIDAK punya akses Operasional (sesuai A6)");
assert(!canAccess(admin, "finance"), "Admin TIDAK punya akses Keuangan (sesuai A6)");
assert(!adminMods.some((m) => m.id === "ops" || m.id === "finance"), "Menu Operasional & Keuangan TIDAK tampil sama sekali di sidebar/kartu");

// 7. Super Admin
console.log("\n7. Pengujian Persona: Super Admin (Budi Santoso)");
const superAdmin = MOCK_USERS.find((u) => u.devPersonaKey === "super_admin")!;
const superMods = getNavigationForUser(superAdmin);
assert(superMods.length === 5, "Melihat seluruh 5 modul");
assert(superMods.some((m) => m.id === "settings"), "Melihat Pengaturan");
assert(canAccess(superAdmin, "finance", "close_period"), "Super Admin berhak Tutup periode");

if (allPassed) {
  console.log("\n>>> SEMUA PENGUJIAN MATRIKS RBAC 8 PERSONA LULUS 100% <<<\n");
  process.exit(0);
} else {
  console.error("\n>>> TERDAPAT PENGUJIAN YANG GAGAL <<<\n");
  process.exit(1);
}
