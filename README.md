# Pembuat Twibbon

**Demo live:** [pembuat-twibbon di GitHub Pages](https://kirax-12.github.io/pembuat-twibbon/)

Web app statis buat memasang foto ke frame twibbon langsung di browser: pilih frame bawaan atau upload frame PNG sendiri, geser dan zoom foto sampai pas, lalu unduh hasilnya sebagai PNG 1080×1080. Gratis, tanpa daftar, tanpa watermark, dan foto tidak pernah meninggalkan browser pengguna.

Dibuat oleh **Remike Dev**.

## Fitur

- **3 frame bawaan** — Merah Putih (kemerdekaan/acara resmi), Ulang Tahun (confetti ceria), Wisuda (biru emas), masing-masing dengan teks yang bisa diganti.
- **Upload frame sendiri** — panitia acara bisa menyiapkan frame PNG transparan, peserta tinggal pasang foto.
- **Atur foto bebas** — geser langsung di pratinjau (drag), slider zoom 50–300%, tombol Pas-kan dan Ke tengah.
- **Unduh PNG 1080×1080** — ukuran pas untuk feed dan story Instagram/WhatsApp.
- **Privat secara desain** — semua pemrosesan memakai Canvas di sisi klien; tidak ada server dan tidak ada foto yang terupload.

## Cara Pakai

1. Upload foto.
2. Pilih frame bawaan atau upload frame PNG.
3. Isi teks frame, geser/zoom foto sampai pas.
4. Klik **Unduh PNG 1080×1080**.

## Cara Kerja

Satu canvas 1080×1080 menggambar tiga lapis: foto (diskalakan cover + offset dari drag/zoom), frame (gambar PNG atau digambar prosedural dengan Canvas API per tema), dan teks banner. Ekspor memakai `canvas.toBlob` menjadi file PNG.

## Teknologi

HTML · CSS · JavaScript murni · Canvas API, tanpa framework dan tanpa build step.

## Lisensi

MIT
