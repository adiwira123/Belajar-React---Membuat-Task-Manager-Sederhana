# 🚀 React Task Manager (To-Do List App)

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Aplikasi **To-Do List Pro** interaktif yang dibangun menggunakan **React 19** dan **Vite**. Memiliki antarmuka visual modern berbasis *Glassmorphism* dan *Dark/Light Theme*, serta fitur-fitur produktivitas lengkap.

---

## ✨ Fitur Utama

- 📝 **Tambah & Kelola Tugas**: Input tugas cepat dengan dukungan tombol `Enter`.
- ✏️ **Edit Tugas Inline**: Klik 2x pada nama tugas untuk mengubah teks secara langsung.
- 🖐️ **Drag & Drop Reordering**: Ubah urutan posisi tugas menggunakan library `@dnd-kit`.
- 📅 **Tenggat Waktu (*Due Date*)**: Peringatan otomatis jika tugas belum selesai melewati batas waktu.
- 🏷️ **Tingkat Prioritas**: Penanda tingkat urgensi tugas (**🔴 Tinggi**, **🟡 Sedang**, **🟢 Rendah**).
- 🔍 **Filter Tugas**: Tampilkan tugas berdasarkan kualifikasi (**Semua**, **Aktif**, **Selesai**).
- ☀️/🌙 **Dark & Light Mode Toggle**: Ganti skema tema warna secara instan.
- 💾 **LocalStorage Persistence**: Data tugas dan pengaturan tema tersimpan otomatis di browser.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Drag & Drop**: [`@dnd-kit/core`](https://dndkit.com/), [`@dnd-kit/sortable`](https://dndkit.com/)
- **Styling**: Vanilla CSS (Variables, Glassmorphism, Responsive Grid/Flexbox)
- **State & Storage**: React Hooks (`useState`, `useEffect`, `useRef`), `localStorage` API

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Clone repository ini**:
   ```bash
   git clone https://github.com/adiwira123/Belajar-React---Membuat-Task-Manager.git
   cd Belajar-React---Membuat-Task-Manager
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

4. **Buka di browser**:
   Akses `http://localhost:5173/` di browser kamu.
