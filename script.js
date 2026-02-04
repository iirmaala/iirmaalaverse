// ======================
// 1️⃣ Data siswa & absensi
// ======================
const siswa = [
  { username: "azam", password: "1", nama: "Agha Muhammad Azam Ar-Rosyid" },
  { username: "arga", password: "2", nama: "Aldiansah Arga Pratama" },
  { username: "fahad", password: "3", nama: "Fahad Ahmad Alamudi" },
  { username: "intan", password: "4", nama: "Intan Nirmalasari Salabila Roskiani" },
  { username: "farid", password: "5", nama: "Mohammad Farid Syaifulloh" },
  { username: "musyafa", password: "6", nama: "Mohammad Musyafa Akbar" },
  { username: "irfan", password: "7", nama: "Muhammad Irfan Arisaputra Islahudin" },
  { username: "michael", password: "8", nama: "Muhammad Michael Al-Muhith" },
  { username: "rheisy", password: "9", nama: "Naila Rheisy Admaja Veaka" },
  { username: "salma", password: "10", nama: "Salma Larissa Indrasari" }
];

// absensi awal untuk semua siswa (default Alpha)
let absensi = siswa.map(s => ({
  username: s.username,
  nama: s.nama,
  kelas: "11-2",
  status: "Alpha"
}));

// ======================
// 2️⃣ Login
// ======================
function login() {
  const inputUser = document.getElementById("username").value.toLowerCase().trim();
  const inputPass = document.getElementById("password").value.trim();
  const loginMsg = document.getElementById("loginMsg");

  const user = siswa.find(s => s.username === inputUser && s.password === inputPass);

  if (user) {
    // login berhasil
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";

    // tampilkan daftar siswa
    tampilkanDaftarSiswa();

    // tampilkan absensi awal
    tampilkanAbsensi();

    // tampilkan tugas awal
    tampilkanTugas();

    // tampilkan motivasi random
    motivasiRandom();

  } else {
    loginMsg.textContent = "Username atau password salah!";
    loginMsg.style.color = "red";
  }
}

// ======================
// 3️⃣ Daftar Siswa
// ======================
function tampilkanDaftarSiswa() {
  const daftar = document.getElementById("daftarSiswa");
  daftar.innerHTML = siswa.map(s => `<li>${s.nama}</li>`).join("");
}

// ======================
// 4️⃣ Absensi Interaktif
// ======================
function tampilkanAbsensi() {
  const list = document.getElementById("absensiList");
  list.innerHTML = "";

  absensi.forEach((s, index) => {
    list.innerHTML += `
      <div>
        <strong>${s.nama} (${s.kelas})</strong>
        <select onchange="ubahAbsensi(${index}, this.value)">
          <option value="Hadir" ${s.status==="Hadir"?"selected":""}>Hadir</option>
          <option value="Izin" ${s.status==="Izin"?"selected":""}>Izin</option>
          <option value="Sakit" ${s.status==="Sakit"?"selected":""}>Sakit</option>
          <option value="Alpha" ${s.status==="Alpha"?"selected":""}>Alpha</option>
        </select>
      </div>
    `;
  });
}

function ubahAbsensi(index, value) {
  absensi[index].status = value;
}

// ======================
// 5️⃣ Tugas / PR Interaktif
// ======================
let tugas = [
  { mapel: "Bahasa Indonesia", isi: ["Membuat Naskah Drama", "Asesmen Formatif halaman 12 BAB 1"] },
  { mapel: "Biologi", isi: ["Membaca Imunitas tubuh dan kelainannya", "Membuat infografis 3 penyakit (berkelompok 2 orang)"] },
  { mapel: "Bahasa Inggris", isi: ["Mengerjakan LKS halaman 4-21"] }
];

function tampilkanTugas() {
  const list = document.getElementById("listTugas");
  list.innerHTML = "";

  tugas.forEach((t, idx) => {
    let items = t.isi.map(i => `<li>${i}</li>`).join("");
    list.innerHTML += `<li><strong>${t.mapel}</strong><ul>${items}</ul></li>`;
  });
}

function tambahTugas() {
  const mapel = prompt("Nama Mata Pelajaran:");
  const isi = prompt("Tugas / PR:");
  if (mapel && isi) {
    tugas.push({ mapel: mapel, isi: [isi] });
    tampilkanTugas();
  }
}

// ======================
// 6️⃣ Motivasi Random
// ======================
const motivasiArray = [
  "Kerja keras hari ini, sukses esok hari!",
  "Jangan menyerah, tiap usaha pasti ada hasilnya!",
  "Belajar dengan senang hati, raih prestasi maksimal!",
  "Setiap hari adalah kesempatan baru untuk jadi lebih baik!"
];

function motivasiRandom() {
  const idx = Math.floor(Math.random() * motivasiArray.length);
  document.getElementById("motivasiText").textContent = motivasiArray[idx];
}

// ======================
// 7️⃣ Scan Wajah Sederhana (Snapshot Kamera)
// ======================
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => { video.srcObject = stream; })
.catch(err => { console.log("Error akses kamera: " + err); });

function ambilFoto() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  alert("Foto berhasil diambil (snapshot)!");
}

// ======================
// 8️⃣ Calendar (Sederhana)
// ======================
function lihatTanggal() {
  const tanggal = document.getElementById("calendarDate").value;
  const p = document.getElementById("selectedDate");

  if (!tanggal) return;

  // contoh: tampilkan tugas dan absensi hari ini
  let tugasHariIni = tugas.map(t => t.isi.join(", ")).join("; ");
  let absensiHariIni = absensi.map(a => `${a.nama}: ${a.status}`).join("; ");

  p.innerHTML = `<strong>${tanggal}</strong><br>Tugas: ${tugasHariIni}<br>Absensi: ${absensiHariIni}`;
}
