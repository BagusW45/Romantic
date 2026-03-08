const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Password admin
const ADMIN_PASSWORD = 'cipa2025';

// ─── STATIC FILES (harus di atas semua route!) ───────────────────────────────

app.use(cors());
app.use(express.json());

// Folder upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Sajikan /images → folder images/ (video, musik, foto profil)
app.use('/images', express.static(path.join(__dirname, 'images'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
    if (filePath.endsWith('.mp3')) res.setHeader('Content-Type', 'audio/mpeg');
  }
}));

// Sajikan /uploads → folder uploads/ (foto yang diupload)
app.use('/uploads', express.static(uploadDir));

// Sajikan file frontend dari public/
app.use(express.static(path.join(__dirname, 'public')));


// Konfigurasi multer untuk upload foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diizinkan (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // Max 20MB per file
});

// ─── API ENDPOINTS ───────────────────────────────────────────────────────────

// GET /api/photos — ambil semua foto
app.get('/api/photos', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Gagal membaca folder foto' });

    const imageFiles = files.filter(f => /\.(jpeg|jpg|png|gif|webp)$/i.test(f));
    const photos = imageFiles.map(f => ({
      filename: f,
      url: `/uploads/${f}`
    }));

    res.json(photos);
  });
});

// POST /api/upload — upload foto baru (butuh password)
app.post('/api/upload', (req, res, next) => {
  const auth = req.headers['x-admin-password'];
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password salah!' });
  }
  next();
}, upload.array('photos', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Tidak ada file yang diupload' });
  }
  const uploaded = req.files.map(f => ({
    filename: f.filename,
    url: `/uploads/${f.filename}`
  }));
  res.json({ success: true, uploaded });
});

// DELETE /api/photos/:filename — hapus foto (butuh password)
app.delete('/api/photos/:filename', (req, res) => {
  const auth = req.headers['x-admin-password'];
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password salah!' });
  }

  const filename = req.params.filename;
  // Keamanan: pastikan tidak ada path traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Nama file tidak valid' });
  }

  const filePath = path.join(uploadDir, filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: 'File tidak ditemukan' });
    res.json({ success: true, deleted: filename });
  });
});


// Fallback: halaman tidak ditemukan → tampilkan index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`🔑 Admin panel: http://localhost:${PORT}/admin.html`);
});
