# PRD Centro Platform v1.3

Platform operasional terintegrasi untuk Cetrofarm.
**Status:** Final Blueprint (revisi dari v1.2). **Dokumen ini adalah sumber kebenaran untuk AI agent. Jika ada ambiguitas, berhenti dan tanyakan, jangan menebak.**

**Perubahan utama v1.3:** struktur organisasi (divisi, region, FA, Finance Corp) dimasukkan ke model data dan RBAC (4.5); scope `region` dan `division`; `region_id` pada customers, PO, invoice; asumsi A4-A6; tahap interim spreadsheet di Google Drive (Lampiran C); pertanyaan terbuka diperbarui.

**Perubahan utama v1.2:** keputusan resmi menggantikan "Pertanyaan Terbuka"; ruang lingkup dipecah menjadi MVP (Fase 0-1) dan Roadmap; skema database dilengkapi; aturan matching, dispute, dan penutupan periode didefinisikan; konvensi untuk AI agent ditambahkan.

---

## 1. Ringkasan

### 1.1 Visi

Satu ekosistem yang menghubungkan identitas karyawan, transaksi operasional, dokumen, supplier, logistik, HRIS, dan dashboard manajemen.

### 1.2 Masalah yang Diselesaikan

- Rekonsiliasi PO, BTB, invoice, dan pembayaran masih manual di Excel.
- Tidak ada visibilitas transaksi secara real time.
- Dokumen tersebar dan tidak terhubung ke transaksi.
- Proses approval dan biaya operasional belum terdigitalisasi.

### 1.3 Prinsip Inti

1. EmployeeID sebagai identitas tunggal.
2. Semua aktivitas tercatat dalam audit log.
3. Dokumen menjadi lampiran transaksi.
4. Database sebagai sumber kebenaran utama; Drive hanya storage.
5. Modular dan scalable.
6. Mobile-friendly.
7. Data keuangan tidak dihapus permanen (soft delete) dan periode yang sudah ditutup tidak dapat diubah.
8. Aturan bisnis yang belum final disimpan sebagai **setting yang dapat diubah**, bukan hardcode.

### 1.4 Ruang Lingkup

| Kategori | Isi |
| --- | --- |
| **Interim (sebelum ada VPS)** | Spreadsheet CentroOPS di Google Drive: satu tab per tabel PRD dengan nama tab dan kolom yang sama, dokumen di folder Drive (Lampiran C). Tujuan: membuktikan aturan matching dan menjadi bahan impor Fase 1d. |
| **MVP (dikerjakan sekarang)** | Fase 0 Fondasi Teknis, Fase 1 CentroID + CentroOPS |
| **Roadmap (setelah MVP stabil dan dipakai Finance)** | Fase 2 CentroDrive, Fase 3 Procurement, Fase 4 LogisticsExpense, Fase 5 ApprovalEngine, Fase 6 CentroHR + ExecutiveDashboard |
| **Ditunda** | Fase 7: Payroll, Integrasi Bank, AI Assistant, integrasi lain |

**Aturan untuk agent:** hanya kerjakan fase yang diminta secara eksplisit. Jangan membangun fitur Fase 2+ saat mengerjakan MVP, kecuali kerangka yang disebut tegas di Fase 0.

---

## 2. Keputusan Resmi

Jawaban atas pertanyaan terbuka v1.1. Keputusan ini mengikat.

| # | Topik | Keputusan |
| --- | --- | --- |
| D1 | Pemilik produk dan maintainer | Perusahaan (Cetrofarm) sebagai pemilik; dikembangkan dan dipelihara oleh satu orang (Dept Head Data Center) sebagai tugas resmi kantor, dikerjakan bertahap. Bus factor = 1, mitigasi: dokumentasi dan kode sederhana. |
| D2 | Tim dan pengguna awal | Satu developer. Pengguna awal: tim Finance/Admin (jumlah kecil). |
| D3 | Toleransi matching dan dispute | **Belum final.** Default sementara: toleransi Rp 1.000, disimpan di tabel `settings`. Dispute diubah/diselesaikan oleh role `finance` atau `admin`, alasan wajib. Validasi ke Finance saat UAT. |
| D4 | Build vs buy | Membangun sendiri, keputusan sadar ("punya sistem sendiri"). ERPNext/Odoo tidak dipakai. Risiko diterima. |
| D5 | Penutupan periode | Closing tanggal 25 setiap bulan (lihat 4.3). |
| D6 | Kepatuhan | UU PDP. Data keuangan disimpan tanpa dihapus (praktik umum retensi dokumen perusahaan ±10 tahun; konfirmasi ke akuntansi/pajak). |
| D7 | Zona waktu dan mata uang | `Asia/Jakarta`; mata uang default `IDR`. Simpan timestamp dalam UTC, tampilkan dalam WIB. |

### Asumsi yang perlu dikonfirmasi

- **A1:** Periode akuntansi berjalan tanggal 26 bulan sebelumnya sampai tanggal 25 bulan berjalan. Kode periode memakai bulan tanggal akhir (contoh: 26 Sep - 25 Okt 2026 = `2026-10`).
- **A2:** Transaksi bertanggal di periode yang sudah ditutup ditolak. Transaksi susulan dicatat ke periode terbuka berjalan dengan tanggal posting hari itu, dengan field `original_date` untuk tanggal dokumen asli.
- **A3:** Periode yang ditutup dapat dibuka kembali hanya oleh `super_admin`, dengan alasan wajib dan tercatat di audit log.
- **A4:** Nomor PO, BTB, dan invoice berbeda antar customer, sehingga unik global per tipe dokumen. Diverifikasi saat data Excel tersedia; bila ternyata ada yang kembar, aturan unik dipindah ke per customer.
- **A5:** Setiap customer dilayani tepat satu region. Region I = Jawa Tengah, Region II = Jawa Barat. Cakupan Region III belum diketahui dan di luar MVP sampai dikonfirmasi.
- **A6 (usulan, belum diputuskan):** FA I dan FA II memakai role `finance` dengan scope `region` (atau divisi). Finance Corp memakai role `finance` dengan scope `company`; hanya scope `company` yang boleh `close_period` dan `resolve_dispute`. Role `admin` (Data Center) mengurus teknis, master data, dan setting, tidak memutus angka keuangan. Memerlukan persetujuan Finance Corp (terkait D3).

---

## 3. Arsitektur dan Teknologi

| Lapisan | Pilihan |
| --- | --- |
| Frontend | Next.js (App Router), TypeScript, TailwindCSS, ShadcnUI |
| Backend | NestJS, TypeScript, REST API (OpenAPI/Swagger) |
| ORM / Migrasi | Prisma atau TypeORM (pilih satu di Fase 0, catat di `/docs/adr`); semua perubahan skema lewat migration |
| Database | PostgreSQL |
| Autentikasi | Login internal dan Google Login, JWT access token + refresh token |
| Storage | Google Drive (utama), S3 / Cloudflare R2 (masa depan) |
| Deployment | Satu VPS dengan Docker Compose; environment staging dan production; CI/CD (GitHub Actions) |

### 3.1 Keputusan Teknis Wajib

- **Storage abstraction:** semua akses file lewat interface `StorageProvider`. Simpan `checksum` (SHA-256) file di database.
- **Tipe uang:** `NUMERIC(18,2)`. Dilarang `float`/`double`. Di kode TypeScript gunakan library desimal (mis. `decimal.js`), bukan `number`, untuk perhitungan uang. Transaksi menyertakan `currency` dan kolom pajak (PPN).
- **Kolom standar** di semua tabel transaksi dan master: `id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`.
- **Soft delete:** data keuangan hanya soft delete (`deleted_at`). Query default wajib memfilter `deleted_at IS NULL`.
- **Audit log immutable:** hanya append (tidak ada UPDATE/DELETE, dijaga di level database lewat permission atau trigger). Mencatat siapa, kapan, aksi, entitas, nilai sebelum dan sesudah, IP.
- **Keamanan:** refresh token dengan rotasi dan revocation, rate limiting login, 2FA (TOTP) untuk `super_admin`, `admin`, dan `finance`, enkripsi data sensitif, password hashing (argon2/bcrypt), validasi input di semua endpoint.
- **Soft delete vs UU PDP:** data keuangan = soft delete. Data pribadi karyawan yang berhenti = **anonimisasi** (nama, kontak, dll. dikaburkan) sambil mempertahankan `employee_id` agar jejak audit dan transaksi tetap utuh.
- **Operasional:** backup database otomatis harian, uji restore berkala (minimal tiap kuartal), monitoring dasar (health check, error log), dokumentasi pemulihan.
- **Penomoran dokumen** (`po_number`, `invoice_number`, dll.) berasal dari data eksternal/Excel, jadi tidak di-generate otomatis; wajib unik per tipe secara global (asumsi A4, diverifikasi saat analisis data Excel).

---

## 4. Aturan Bisnis Lintas Modul

### 4.1 Role dan Permission

**Roles** (lengkap, menggantikan v1.1): `super_admin`, `admin`, `finance`, `hr`, `manager`, `director`, `supervisor`, `employee`.

**Permission:** `create`, `read`, `update`, `delete` (soft), `approve`, `close_period`, `resolve_dispute`, dengan **scope**: `own`, `department`, `region`, `division`, `company` (lihat 4.5).

Matriks role-permission-scope disimpan sebagai seed data dan didokumentasikan di `/docs/rbac-matrix.md`. Matriks ini **wajib direview manusia**.

Ringkasan awal (untuk MVP):

| Role | Akses utama MVP |
| --- | --- |
| super_admin | Semua, termasuk reopen periode dan manajemen role |
| admin | Kelola master data, user, setting; resolve dispute |
| finance | CRUD transaksi OPS, import data; resolve dispute dan close periode sesuai asumsi A6 (FA: scope region; Finance Corp: scope company) |
| manager / director | Read company-scope laporan OPS |
| supervisor / employee / hr | Hanya data direktori sesuai scope (OPS tidak diakses di MVP) |

### 4.2 Matching dan Dispute

**Setting (tabel `settings`, bisa diubah admin, perubahan masuk audit log):**

| Key | Default | Keterangan |
| --- | --- | --- |
| `matching.tolerance_amount` | `1000.00` | Selisih absolut (IDR) yang masih dianggap `matched` |
| `matching.overdue_grace_days` | `0` | Tambahan hari sebelum alert overdue |

**Definisi:**

- `invoice_total` = `amount + tax`.
- `allocated_total` = jumlah `allocated_amount` dari seluruh `payment_allocations` untuk invoice tersebut.
- `deduction_total` = jumlah `deduction_amount` (retur, denda, potongan lain) pada alokasi invoice tersebut. Potongan **mengurangi sisa piutang** dan wajib punya `deduction_type` dan catatan.
- `outstanding` = `invoice_total - allocated_total - deduction_total`.

**Status invoice (turunan, dihitung ulang tiap ada perubahan alokasi):**

| Status | Kondisi |
| --- | --- |
| `unpaid` | `allocated_total + deduction_total = 0` dan tidak ada flag dispute |
| `partial` | Ada alokasi, tetapi `outstanding > tolerance` |
| `matched` | `abs(outstanding) <= tolerance` |
| `dispute` | Di-set manual (atau dari overpayment `outstanding < -tolerance`); mengunci status otomatis sampai diselesaikan |

**Dispute:**

- Hanya `finance` atau `admin` yang boleh membuat resolusi dan mengubah status dispute.
- Resolusi wajib berisi alasan, dicatat di `dispute_log` dan `audit_logs`.
- Setelah resolusi, status dihitung ulang dari data alokasi.

**Level PO:** status PO ditampilkan sebagai ringkasan dari BTB dan invoice terkait (total PO vs total BTB vs total invoice vs total terbayar).

**Koreksi manual:** setiap koreksi manual terhadap hasil matching dicatat di `matching_records` (nilai sebelum, sesudah, alasan, siapa) sebagai data latihan untuk fase AI.

**Alert:**

| Alert | Kondisi |
| --- | --- |
| `invoice_not_created` | BTB sudah ada tetapi belum tercakup invoice setelah N hari (setting) |
| `overdue_payment` | `due_date` lewat dan invoice belum `matched` |
| `amount_mismatch` | Total BTB vs total invoice berbeda melebihi toleransi |
| `missing_btb` | Invoice tanpa BTB terkait |
| `overpayment` | `outstanding < -tolerance` |

### 4.3 Penutupan Periode (Closing)

- Tabel `accounting_periods`: `period_code`, `start_date`, `end_date`, `status` (`open`/`closed`), `closed_by`, `closed_at`, `reopened_by`, `reopened_at`, `reopen_reason`.
- Periode berjalan 26 s/d 25 (asumsi A1).
- Closing dilakukan oleh `finance` (atau `super_admin`) setelah tanggal 25.
- Selama `closed`: INSERT, UPDATE, dan soft delete pada transaksi yang tanggal posting-nya berada di periode itu **ditolak di level service dan dijaga trigger database**.
- Reopen hanya `super_admin`, alasan wajib, tercatat di audit log.
- Berlaku untuk: purchase_orders, deliveries, invoices, payments, payment_allocations.

### 4.4 Lampiran Sementara (Fase 1)

Sebelum CentroDrive, lampiran disimpan di tabel `attachments` (polimorfik: `entity_type`, `entity_id`, `storage_key`, `file_name`, `mime_type`, `size`, `checksum`). Di Fase 2 data ini dimigrasikan ke `documents`.

---

### 4.5 Struktur Organisasi, Divisi, dan Region

Sumber: bagan struktur organisasi perusahaan. Garis struktural = atasan langsung; garis fungsional = pelaporan teknis lintas unit.

**Hierarki:**

| Divisi | Unit di bawahnya |
| --- | --- |
| Mark & Dev | (belum dirinci di bagan) |
| Operation I (Sayuran) | Region I (Jawa Tengah), Region II (Jawa Barat), Region III (cakupan belum diketahui). Tiap region memiliki: Supply Chain (SC Officer), Sales (Sales Officer), FA I |
| Operation II (Ayam) | Production RPU, Farmer Program Coordinator, FA II |
| Finance | Finance Corp |
| Support | HR & GA, Data Center, Legal & Comp. |

**Hubungan fungsional:** FA I dan FA II secara struktural berada di bawah region/divisi masing-masing, tetapi secara fungsional melapor ke Finance Corp.

**Dampak pada model data:**

- `departments` menjadi hierarkis: tambah `parent_id` dan `unit_type` (`division` / `region` / `department`). Region adalah unit bertipe `region` di bawah divisi Operation I.
- `employees` menambah `region_id` (nullable), `manager_id` (struktural), dan `functional_manager_id` (fungsional, nullable).
- `customers.region_id` wajib (asumsi A5). `purchase_orders` dan `invoices` menyimpan `region_id` yang disalin dari customer saat dibuat, dipakai untuk filter scope. Payment mengikuti region dari invoice yang dialokasikan.
- Scope `region` hanya melihat data dengan `region_id` yang sama; scope `division` melihat seluruh region di divisinya; scope `company` melihat semuanya.

**Catatan MVP:** transaksi OPS saat ini hanya mencakup lini Sayuran (Operation I). Lini Ayam (Operation II) dan dimensi lain menyusul setelah aturannya dikonfirmasi.

---

## 5. Fase 0: Fondasi Teknis (MVP)

**Tujuan:** menyiapkan dasar yang mahal jika dirombak belakangan.
**Estimasi:** 2-3 minggu.

**Cakupan:**

- Monorepo (`apps/web`, `apps/api`, `packages/shared`), standar kode (ESLint, Prettier, commit convention), struktur modul NestJS.
- Docker Compose untuk lokal, staging, production; CI/CD (lint, test, build, deploy ke staging otomatis; production manual approve).
- Manajemen konfigurasi dan secret (tidak ada secret di repo; `.env.example` saja).
- Backup database otomatis dan skrip restore.
- Modul audit log (append-only) dan modul notifikasi dasar (in-app).
- Tabel `settings`.
- Skema `approvals` dan `approval_steps` generik (kerangka saja; UI di Fase 5).
- `StorageProvider` interface + implementasi Google Drive + implementasi lokal untuk testing.
- Health check, logging terstruktur.
- Dokumen: `/docs/architecture.md`, `/docs/adr/`, `/docs/runbook.md`.

**Kriteria selesai:**

- Push ke branch utama men-deploy otomatis ke staging.
- Backup dan **restore terbukti berhasil** di environment terpisah (diverifikasi manusia).
- Audit log mencatat aksi dari satu endpoint contoh, dan UPDATE/DELETE pada `audit_logs` ditolak database.
- `StorageProvider` lolos test upload, download, hapus, dan verifikasi checksum.

---

## 6. Fase 1: CentroID dan CentroOPS (MVP)

### 6.1 CentroID (2-3 minggu)

**Tujuan:** pondasi identitas tunggal seluruh sistem.

**Entitas:**

- `employees`: employee_id, full_name, email, phone, department_id, region_id (nullable), position_id, role_id, manager_id, functional_manager_id (nullable), employment_status
- `roles`, `permissions`, `role_permissions` (dengan scope)
- `departments` (hierarkis: parent_id, unit_type; lihat 4.5), `positions`
- `auth_identities` (provider: internal/google), `sessions`/`refresh_tokens` (rotasi dan revocation), `user_2fa`

**Fitur:** login internal, Google Login, logout, refresh token, manajemen role dan permission, direktori karyawan, audit session, 2FA untuk role tertentu.

**Kriteria penerimaan:**

- Pengguna dapat login via akun internal dan Google.
- Hak akses dibatasi sesuai matriks role-permission-scope (diuji otomatis per role).
- Setiap login, logout, gagal login, dan perubahan role tercatat di audit log.
- Refresh token dapat direvoke; rate limit login aktif.
- 2FA wajib untuk `super_admin`, `admin`, `finance`.

### 6.2 CentroOPS (dikerjakan bertahap)

**Tujuan:** menghilangkan rekonsiliasi manual Excel dan memberi visibilitas transaksi real time.

**Urutan (setiap langkah = satu PR yang direview):**

1. **1b-1** `accounting_periods` + `settings` + Customers, Purchase Orders, Deliveries (BTB) + lampiran
2. **1b-2** Invoices + `invoice_deliveries`
3. **1b-3** Payments + `payment_allocations`
4. **1c** Matching engine + alert (**test-first**)
5. **1d** Import Excel historis + laporan error

**Modul dan field:**

| Modul | Field Utama |
| --- | --- |
| customers | customer_code, customer_name, customer_type, region_id, alamat, npwp, payment_terms |
| purchase_orders | po_number, po_date, customer_id, region_id, amount, currency, status |
| deliveries | btb_number, po_id, delivery_date, amount |
| invoices | invoice_number, invoice_date, due_date, region_id, amount, tax, currency, status |
| invoice_deliveries | invoice_id, delivery_id, amount |
| payments | payment_number, payment_date, **direction** (`in`/`out`), amount, currency, source (`manual`/`bank`), bank_reference, notes |
| payment_allocations | payment_id, invoice_id (nullable), vendor_bill_id (nullable, dipakai Fase 3), allocated_amount, deduction_amount, deduction_type, deduction_note |

**Catatan skema:**

- `payment_allocations` memiliki CHECK: tepat satu dari `invoice_id` atau `vendor_bill_id` terisi. Di MVP hanya `invoice_id` dipakai dan `direction = in`.
- Kolom `original_date` pada transaksi untuk kasus susulan (A2).
- Semua tabel transaksi memuat kolom standar (3.1).

**Relasi many-to-many yang wajib didukung:**

- Satu PO punya banyak BTB (pengiriman parsial).
- Satu invoice mencakup banyak BTB (`invoice_deliveries`).
- Satu pembayaran melunasi banyak invoice, dan satu invoice dibayar bertahap (`payment_allocations`).

**Tabel pendukung baru:** `accounting_periods`, `settings`, `matching_records`, `dispute_log`, `import_batches`, `import_errors`, `attachments`.

**Kriteria penerimaan Fase 1 (OPS):**

- Data Excel nyata dapat diimpor dan hasil matching **cocok dengan rekonsiliasi manual Finance** untuk satu periode sampel.
- Status matching tampil real time per PO, per invoice, dan per customer.
- Semua alert di 4.2 muncul untuk kondisi yang didefinisikan.
- Transaksi pada periode closed tidak dapat diubah (diuji di level API dan database).
- Impor idempoten: menjalankan file yang sama dua kali tidak menciptakan duplikat; laporan error per baris tersedia.
- Test otomatis mencakup: toleransi (di bawah, tepat di batas, di atas), potongan, overpayment, alokasi parsial, dan satu pembayaran ke banyak invoice.

**Migrasi data:** impor Excel (PO, BTB, invoice, payment) lewat `import_batches` dengan tahap: validasi, deteksi duplikat, pratinjau (dry run), commit, laporan error. Satu batch bisa di-rollback sebelum periode ditutup.

---

## 7. Roadmap (Setelah MVP Stabil)

Detail dibuat saat fase dimulai (spec per fase di `/docs/phases/`).

### Fase 2: CentroDrive (±1 bulan)

Dokumen terstruktur dan terhubung ke transaksi. Tipe: purchase_order, btb, invoice, payment_proof, vendor_bill, expense. Metadata: document_id, employee_id, transaction_id, upload_date, document_type, department, checksum. Fitur: upload, pencarian, versioning, tagging, audit log. Tabel: `documents`, `document_versions`. Migrasi dari `attachments`; file hilang/berubah terdeteksi lewat checksum.

### Fase 3: Procurement (±1 bulan)

Entitas: `suppliers` (supplier_code, supplier_name, category), `weighbridge` (transaction_date, supplier_id, weight, price), `vendor_bills` (bill_number, supplier_id, amount, tax, due_date, payment_status). Pembayaran vendor memakai `payments` dengan `direction = out` dan alokasi ke `vendor_bill_id`. Approval procurement memakai alur sementara (manager, director) di kerangka approval Fase 0 sampai Fase 5.

### Fase 4: LogisticsExpense (±1 bulan)

Entitas: `vehicles`, `drivers`, `trips`, `fuel`, `expenses`. Output: cost_per_vehicle, cost_per_route, logistics_dashboard. Approval expense memakai alur sementara (supervisor, manager, finance).

### Fase 5: ApprovalEngine (±2 minggu)

Workflow: Leave (supervisor, hr), Expense (supervisor, manager, finance), Procurement (manager, director). Alur berlapis yang dapat dikonfigurasi, delegasi, riwayat, notifikasi. Kriteria: expense dan procurement berpindah ke engine ini tanpa kehilangan riwayat.

### Fase 6: CentroHR (tanpa payroll) + ExecutiveDashboard dasar (±1-2 bulan)

HR: employee_management, attendance (GPS, selfie; pertimbangkan anti-manipulasi lokasi dan perlindungan data foto sesuai UU PDP), leave. Dashboard: sales, procurement, logistics, hr.

**Definisi metrik dashboard (wajib dipakai konsisten):**

| Metrik | Definisi |
| --- | --- |
| revenue | Jumlah `amount` invoice (di luar PPN) berdasarkan `invoice_date` pada periode akuntansi |
| outstanding_receivables | Jumlah `outstanding` seluruh invoice yang belum `matched` |
| top_customers | Peringkat customer berdasarkan revenue pada periode |
| supplier_payables | Jumlah sisa vendor_bill yang belum dibayar |

Widget cashflow dan margin menyusul setelah data pembayaran dan biaya lengkap.

### Fase 7: Payroll, Integrasi Bank, AI Assistant (menyusul)

Payroll (PPh 21, BPJS; RBAC ketat, enkripsi), integrasi bank (`source` dan `bank_reference` sudah disiapkan), AI (OCR invoice, klasifikasi dokumen, auto-matching, deteksi risiko supplier, forecast cashflow, Copilot) memakai data koreksi `matching_records`. Integrasi lain: WhatsApp, Email, Google Workspace.

---

## 8. Struktur Database Inti

| Kelompok | Tabel | Fase |
| --- | --- | --- |
| Identitas | employees, departments, positions, roles, permissions, role_permissions, auth_identities, refresh_tokens, user_2fa | 1 |
| Master | customers | 1 |
| Master | suppliers | 3 |
| Transaksi OPS | purchase_orders, deliveries, invoices, invoice_deliveries, payments, payment_allocations | 1 |
| Matching | matching_records, dispute_log | 1 |
| Periode & konfigurasi | accounting_periods, settings | 0/1 |
| Import | import_batches, import_errors | 1 |
| Lampiran | attachments | 1 |
| Sistem | audit_logs, notifications, approvals, approval_steps | 0 |
| Dokumen | documents, document_versions | 2 |
| Procurement | vendor_bills, weighbridge | 3 |
| Logistik | vehicles, drivers, trips, fuel, expenses | 4 |
| HR | attendance, leave_requests | 6 |
| HR (Fase 7) | payroll | 7 |

---

## 9. Metrik Keberhasilan

- Waktu rekonsiliasi bulanan turun dibanding proses Excel (ukur baseline **sebelum** go-live; target ditetapkan setelahnya).
- Persentase invoice berstatus `matched` tanpa intervensi manual.
- Jumlah dispute terselesaikan dalam batas waktu yang disepakati.
- Persentase transaksi dengan lampiran lengkap.
- Persentase pengguna aktif per minggu.

---

## 10. Risiko dan Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Kualitas data Excel buruk | Waktu khusus migrasi, impor bertahap dengan dry run, validasi bersama Finance |
| Satu developer (bus factor 1) | Dokumentasi, ADR, kode sederhana, runbook, backup terverifikasi |
| Dikerjakan satu orang di sela tugas lain, progres lambat | Bertahap per fase dan per PR; tahap interim spreadsheet memberi nilai lebih awal; tidak mengejar tenggat yang tidak realistis |
| Scope terlalu besar untuk satu orang | MVP dibatasi Fase 0-1; fase berikutnya hanya setelah MVP dipakai nyata |
| Aturan matching belum final | Setting yang dapat diubah, test mencakup batas toleransi, validasi UAT |
| Kode AI tidak benar pada logika uang/keamanan | Review manusia wajib pada auth, RBAC, matching, periode, migrasi; test acceptance dari data nyata |
| Ketergantungan Google Drive | StorageProvider, checksum, backup |
| Adopsi rendah | Libatkan Finance sejak prototipe, UAT per modul, pelatihan singkat |
| Kebocoran data sensitif | RBAC dengan scope, enkripsi, 2FA, audit log; data dummy di repo |
| Sengketa kepemilikan kode | Kesepakatan tertulis dengan perusahaan |

---

## 11. Pertanyaan yang Masih Terbuka

1. Angka final toleransi matching dan wewenang dispute (default 4.2 dipakai sementara).
2. Konfirmasi asumsi A1-A3 (periode 26-25, transaksi susulan, reopen) dengan Finance.
3. Konfirmasi A4 (nomor dokumen unik global) setelah melihat data Excel.
4. Jumlah dan format file Excel historis yang akan diimpor (butuh contoh data anonim sebelum Fase 1d).
5. Cakupan Region III dan apakah termasuk MVP.
6. Konfirmasi A6: pembagian peran FA vs Finance Corp, dan batas wewenang `admin` (Data Center) terhadap dispute dan reopen periode.
7. Apakah Sales Officer dan SC Officer perlu akses baca data OPS di region-nya (saat ini MVP: tidak).

---

## Lampiran A: Konvensi untuk AI Agent (Antigravity)

**Aturan wajib:**

1. Baca `/docs/phases/<fase>.md` dan PRD ini sebelum merencanakan. Mulai dengan **Implementation Plan**; tunggu persetujuan manusia sebelum menulis kode.
2. Satu modul per task, satu branch dan satu PR per modul. Jangan menyentuh modul di luar task.
3. Uang: `NUMERIC(18,2)` di database, tipe desimal di kode. Dilarang `float`/`number` untuk perhitungan uang.
4. Semua tabel mengikuti kolom standar (3.1). Soft delete saja untuk data keuangan.
5. `audit_logs` append-only. Tidak pernah menulis UPDATE/DELETE ke tabel ini.
6. Akses file hanya lewat `StorageProvider`. Tidak ada panggilan Google Drive langsung di logika bisnis.
7. Setiap endpoint: validasi input, pengecekan permission + scope, pencatatan audit untuk aksi tulis.
8. Aturan bisnis yang dapat berubah (toleransi, grace days) dibaca dari `settings`, bukan konstanta.
9. Transaksi pada periode closed ditolak (service + trigger database).
10. Setiap fitur disertai test. Logika matching dan periode ditulis **test-first**.
11. Migration database bersifat maju dan dapat dibaca; jangan mengedit migration yang sudah di-merge.
12. Jangan menjalankan perintah destruktif (drop, reset, deploy production, migrasi ke DB staging/production) tanpa persetujuan manusia.
13. Jangan menaruh secret, kredensial, atau data asli perusahaan di repo. Gunakan data dummy/seed.
14. Jika spesifikasi ambigu atau bertentangan, berhenti dan ajukan pertanyaan.

**Wajib direview manusia baris demi baris:** autentikasi dan 2FA, RBAC dan matriks permission, matching engine, perhitungan uang, penutupan periode, skrip migrasi/import, backup dan restore.

**Definition of Done per modul:**

- [ ] Migration, entity, service, controller, dan DTO selesai
- [ ] Test unit dan integrasi lulus (termasuk kasus batas)
- [ ] Permission dan scope teruji per role
- [ ] Aksi tulis tercatat di audit log
- [ ] Dokumentasi API (OpenAPI) diperbarui
- [ ] UI diverifikasi (walkthrough/screenshot) bila ada
- [ ] PR direview manusia dan lulus CI

---

## Lampiran B: Struktur Repo yang Disarankan

```
centro/
├── apps/
│   ├── api/            # NestJS
│   └── web/            # Next.js
├── packages/
│   └── shared/         # tipe, util (money, date)
├── docs/
│   ├── PRD_Centro_Platform_v1_2.md
│   ├── rbac-matrix.md
│   ├── org-structure.md   # bagan organisasi dan pemetaan region
│   ├── architecture.md
│   ├── runbook.md
│   ├── adr/            # catatan keputusan teknis
│   └── phases/
│       ├── phase-0.md
│       ├── phase-1a-centroid.md
│       ├── phase-1b-ops.md
│       ├── phase-1c-matching.md
│       └── phase-1d-import.md
├── .agent/             # rules dan workflow Antigravity
├── docker-compose.yml
└── .env.example
```

---

## Lampiran C: Struktur Folder Drive dan Tahap Interim Spreadsheet

Dipakai sebelum ada VPS. Drive hanya storage dokumen; pencatatan transaksi di spreadsheet (`00_DATABASE_CENTRO`).

```
trial/
├── 00_DATABASE_CENTRO/          # usulan: spreadsheet CentroOPS + settings
├── 01_COMMERCIAL_SALES/2026/
│   ├── SUPERINDO/ (01_PO_MASUK, 02_BTB_PENERIMAAN, 03_FAKTUR_PENJUALAN)
│   └── AEON_RETAIL/               # samakan tiga subfolder di atas
├── 02_PROCUREMENT_MITRA/2026/     # MITRA_SAYUR, MITRA_AYAM (dicatat mulai Fase 3)
├── 03_LOGISTIK_OPERASIONAL/2026/  # SURAT_JALAN_TRAYEK, BUKTI_BBM_OPERASIONAL (Fase 4)
├── 04_FINANCE_ACCOUNTING/2026/    # SUMMARY_REKONSILIASI, SETTLEMENT_PAYMENT_STATEMENT, VENDOR_BILLS, BUKTI_TRANSFER_BANK
└── 99_ARSIP_DAN_BACKUP/
```

**Penamaan file:** `{TIPE}_{NOMOR}_{YYYYMMDD}.pdf` (contoh `PO_<nomor>_20261008.pdf`, `BTB_...`, `INV_...`). File rekap periode memakai kode periode akuntansi (contoh `2026-10`), bukan bulan kalender.

**Spreadsheet interim:** satu tab per tabel PRD (`customers`, `purchase_orders`, `deliveries`, `invoices`, `invoice_deliveries`, `payments`, `payment_allocations`, `settings`, `accounting_periods`, `dispute_log`) dengan nama kolom sama persis, ditambah `region_id` dan `file_link` (link Drive ke dokumen). Rumus mengikuti 4.2. Keterbatasan: tidak ada audit log immutable, penguncian periode otomatis, atau RBAC per scope; diganti disiplin proses dan version history Drive.

---

## Riwayat Perubahan

| Versi | Perubahan |
| --- | --- |
| 1.0 | Blueprint awal 7 fase |
| 1.1 | Menambah Fase 0; ApprovalEngine dimajukan ke Fase 5; Payroll, bank, AI ke Fase 7; relasi many-to-many, keamanan, risiko, kriteria penerimaan |
| 1.2 | Keputusan resmi menggantikan pertanyaan terbuka; MVP vs Roadmap; role finance/hr/director; direction pada payments; accounting_periods, settings, matching_records, dispute_log, import_batches, attachments; aturan matching, dispute, closing; strategi soft delete vs UU PDP; definisi metrik dashboard; konvensi untuk AI agent |
| 1.3 | Struktur organisasi (4.5): divisi, region, FA, Finance Corp; scope `region`/`division`; `region_id`; asumsi A4-A6; tahap interim spreadsheet dan struktur folder Drive (Lampiran C); D1 diperbarui, D8 dihapus; pertanyaan terbuka diperbarui |
