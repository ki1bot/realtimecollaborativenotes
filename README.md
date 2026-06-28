# Realtime Collaborative Notes

Realtime Collaborative Notes adalah aplikasi web untuk membuat, mengelola, mengedit, dan membagikan catatan dengan sistem autentikasi serta role akses. Project ini dibangun menggunakan Next.js App Router, React, TypeScript, MongoDB, Mongoose, Tailwind CSS, JWT, dan bcryptjs.

Aplikasi ini menggunakan API Route bawaan Next.js pada folder `app/api` tanpa custom server dan tanpa port backend terpisah. Semua proses backend seperti autentikasi, CRUD notes, collaborator, activity log, dan proteksi akses dijalankan melalui Route Handler Next.js.

## Live Demo

https://realtimecollaborativenotes.vercel.app/

## Repository

https://github.com/ki1bot/realtimecollaborativenotes.git

## Fitur Utama

- Halaman utama dapat diakses tanpa login
- Autentikasi pengguna dengan register dan login
- Validasi token menggunakan JSON Web Token
- Password pengguna diamankan menggunakan bcryptjs
- Membuat, membaca, mengedit, dan menghapus catatan
- Autosave perubahan catatan melalui API Route Next.js
- Fitur share note ke pengguna lain sebagai viewer atau editor
- Proteksi akses berdasarkan owner, editor, dan viewer
- Riwayat aktivitas pada setiap catatan
- Pencarian catatan berdasarkan judul, isi, atau pemilik catatan
- Tampilan responsive untuk desktop dan mobile
- Dukungan dark mode dan light mode

## Role Akses

### Owner

Owner adalah pembuat note. Owner dapat mengedit note, menghapus note, membagikan note ke pengguna lain, mengubah role collaborator, dan menghapus collaborator.

### Editor

Editor adalah collaborator yang diberi akses untuk mengubah isi note. Editor dapat membuka dan mengedit note, tetapi tidak dapat menghapus note atau mengatur collaborator.

### Viewer

Viewer adalah collaborator yang hanya diberi akses membaca. Viewer dapat membuka note, tetapi tidak dapat mengedit, menghapus, atau membagikan note.

## Tech Stack

- Next.js
- React
- TypeScript
- MongoDB
- Mongoose
- Tailwind CSS
- Axios
- JSON Web Token
- bcryptjs
- Lucide React

## Struktur Project

```bash
app/
├── api/
│   └── route.ts
├── components/
├── lib/
├── models/
├── types/
├── globals.css
├── layout.tsx
└── page.tsx
```

## Environment Variables

Buat file `.env.local` atau `.env` di root project.

```env
MONGODB_URI=isi_mongodb_uri_kamu
JWT_SECRET=isi_jwt_secret_kamu
JWT_EXPIRES_IN=7d
```

Jangan memasukkan file `.env` ke GitHub. Simpan environment variable di Vercel melalui menu Project Settings.

## Instalasi

Clone repository.

```bash
git clone https://github.com/ki1bot/realtimecollaborativenotes.git
cd realtimecollaborativenotes
```

Install dependencies.

```bash
npm install
```

Jalankan development server.

```bash
npm run dev
```

Buka aplikasi di browser.

```bash
http://localhost:3000
```

## Build Production

```bash
npm run build
npm run start
```

## Script NPM

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deployment

Project ini dapat dideploy ke Vercel sebagai aplikasi Next.js biasa. Karena backend sudah memakai API Route bawaan Next.js, tidak diperlukan custom server, Express server, Socket.IO server, atau port backend terpisah.

Pastikan environment variable berikut sudah ditambahkan di Vercel.

```env
MONGODB_URI=isi_mongodb_uri_kamu
JWT_SECRET=isi_jwt_secret_kamu
JWT_EXPIRES_IN=7d
```

## Catatan Teknis

Project ini sebelumnya menggunakan pendekatan custom server dan Socket.IO. Versi terbaru sudah disederhanakan agar berjalan menggunakan Next.js App Router bawaan, sehingga lebih cocok untuk deployment di Vercel.

## Lisensi

Project ini dibuat untuk kebutuhan pembelajaran dan portofolio pribadi.