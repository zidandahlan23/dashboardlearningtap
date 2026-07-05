# 01 — Netlify Dashboard

Folder ini adalah kode frontend React/Vite beserta Netlify Function. **Folder ini yang dihubungkan ke Netlify.**

## Sebelum deploy

Pastikan Anda sudah menyelesaikan folder `02_APPS_SCRIPT_API` dan memiliki:

```text
1. GOOGLE_APPS_SCRIPT_URL
2. GOOGLE_APPS_SCRIPT_SECRET
```

## Tambahkan Environment Variables di Netlify

Buka:

```text
Netlify → Site configuration → Environment variables
```

Buat semua value berikut dengan scope **Functions**:

| Variable | Isi |
|---|---|
| `GOOGLE_APPS_SCRIPT_URL` | URL Web App Apps Script yang berakhir `/exec` |
| `GOOGLE_APPS_SCRIPT_SECRET` | Nilai `API_SECRET` dari Apps Script |
| `DASHBOARD_ADMIN_PASSWORD` | Password kuat untuk tambah, edit, hapus, dan import data |
| `DASHBOARD_VIEW_PASSWORD` | Opsional. Kosongkan agar dashboard dapat dilihat tanpa password. |

Contoh nilai tersedia di file `.env.example`. Jangan masukkan nilai asli ke GitHub atau source code.

## Cara deploy yang disarankan

Karena project memakai Netlify Function pada:

```text
netlify/functions/certifications.mjs
```

gunakan salah satu cara berikut:

### Opsi A — GitHub (paling mudah untuk jangka panjang)

1. Buat repository GitHub baru.
2. Upload seluruh isi folder `01_NETLIFY_DASHBOARD` ke repository tersebut.
3. Di Netlify pilih **Add new site → Import an existing project**.
4. Pilih repository GitHub tadi.
5. Build settings sudah disiapkan dari file `netlify.toml`:

   ```text
   Build command : npm install && npm run build
   Publish dir   : dist
   ```

6. Klik deploy.

### Opsi B — Netlify CLI

Dari folder `01_NETLIFY_DASHBOARD` jalankan:

```bash
npm install
npm run build
netlify deploy --prod
```

> Jangan upload folder `dist` saja dengan drag-and-drop, karena Netlify Function tidak akan ikut terpasang.

## Tes setelah deploy

1. Buka dashboard.
2. Pastikan data berhasil muncul.
3. Buka **Data Peserta** lalu edit satu data dummy.
4. Masukkan `DASHBOARD_ADMIN_PASSWORD` ketika diminta.
5. Simpan, refresh dashboard, kemudian cek perubahan pada Google Sheets.

## Troubleshooting

| Kondisi | Perbaikan |
|---|---|
| Data tidak muncul | Pastikan `GOOGLE_APPS_SCRIPT_URL` memakai URL `/exec`. |
| Error akses API | Pastikan secret di Netlify sama dengan API_SECRET Apps Script. |
| Password admin ditolak | Samakan password yang dimasukkan dengan `DASHBOARD_ADMIN_PASSWORD`. |
| Edit berhasil tetapi data tidak berubah | Periksa Netlify → Functions → `certifications` → Logs. |
