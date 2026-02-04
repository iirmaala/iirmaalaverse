// ======================
// 0️⃣ Data Awal
// ======================

// Daftar siswa (contoh)
let siswaList = [
  {nama: "Agha Muhammad Azam Ar-Rosyid", panggilan:"azam", absen:1},
  {nama: "Aldiansah Arga Pratama", panggilan:"arga", absen:2},
  {nama: "Fahad Ahmad Alamudi", panggilan:"fahad", absen:3},
  {nama: "Intan Nirmalasari Salabila Roskiani", panggilan:"intan", absen:4},
  {nama: "Mohammad Farid Syaifulloh", panggilan:"farid", absen:5},
  {nama: "Mohammad Musyafa Akbar", panggilan:"musyafa", absen:6},
  {nama: "Muhammad Irfan Arisaputra Islahudin", panggilan:"irfan", absen:7},
  {nama: "Muhammad Michael Al-Muhith", panggilan:"michael", absen:8},
  {nama: "Naila Rheisy Admaja Veaka", panggilan:"rheisy", absen:9},
  {nama: "Salma Larissa Indrasari", panggilan:"salma", absen:10}
];

// Login users (username bisa panggilan/nama/awal, password panggilan+absen)
let loginUsers = siswaList.map(s=>({
  usernameOptions: [s.nama.toLowerCase().replace(/\s/g,''), s.panggilan.toLowerCase()],
  password: (s.panggilan + s.absen).toLowerCase()
}));

// Data absensi & tugas
let absensiData = JSON.parse(localStorage.getItem("absensiData")) || {};
let tugasData = JSON.parse(localStorage.getItem("tugasData")) || [];
let motivasiList = [
  "Hari ini kamu luar biasa 🌸",
  "Tetap semangat dan tersenyum 😄",
  "Setiap usaha pasti membuahkan hasil 💪",
  "Jangan lupa bahagia yaa 😊",
  "Belajar itu menyenangkan, nikmati prosesnya 📚"
];
let kasData = JSON.parse(localStorage.getItem("kasData")) || [];

// ======================
// 1️⃣ Login / Logout
// ======================
function login(){
  let userInput = document.getElementById("username").value.toLowerCase().replace(/\s/g,'');
  let passInput = document.getElementById("password").value.toLowerCase().replace(/\s/g,'');
  let valid = loginUsers.find(u => u.usernameOptions.includes(userInput) && u.password === passInput);
  if(valid){
    document.getElementById("loginSection").style.display="none";
    document.getElementById("appSection").style.display="block";
    renderSiswa();
    renderAbsensi();
    renderTugas();
    renderKas();
    motivasiRandom();
    initCamera();
  } else{
    document.getElementById("loginMsg").innerText="Username atau Password salah 😢";
  }
}
function logout(){
  location.reload();
}

// ======================
// 2️⃣ Tabs
// ======================
function showTab(tabName){
  let tabs = document.getElementsByClassName("tabContent");
  for(let t of tabs){ t.style.display="none"; }
  document.getElementById(tabName).style.display="block";
  let btns = document.getElementsByClassName("tabBtn");
  for(let b of btns){ b.classList.remove("active"); }
  event.target.classList.add("active");
}

// ======================
// 3️⃣ Daftar Siswa + Search
// ======================
function renderSiswa(){
  let list = document.getElementById("daftarSiswa");
  list.innerHTML="";
  siswaList.forEach(s=>{
    let li = document.createElement("li");
    li.className="siswaItem";
    li.innerText = s.nama + " ("+s.panggilan+")";
    list.appendChild(li);
  });
}

function searchSiswa(){
  let val = document.getElementById("searchSiswa").value.toLowerCase();
  let items = document.getElementsByClassName("siswaItem");
  for(let i of items){
    i.style.display = i.innerText.toLowerCase().includes(val)?"block":"none";
  }
}

// ======================
// 4️⃣ Absensi
// ======================
function renderAbsensi(){
  let list = document.getElementById("absensiList");
  list.innerHTML="";
  let today = new Date().toISOString().split('T')[0];
  siswaList.forEach(s=>{
    let div = document.createElement("div");
    div.className="absensiItem";
    let status = (absensiData[today] && absensiData[today][s.panggilan]) || "Alpha";
    div.innerHTML = `
      <strong>${s.nama}</strong><br>
      Status: 
      <select onchange="updateAbsensi('${s.panggilan}', this.value)">
        <option ${status==="Hadir"?"selected":""}>Hadir</option>
        <option ${status==="Izin"?"selected":""}>Izin</option>
        <option ${status==="Sakit"?"selected":""}>Sakit</option>
        <option ${status==="Alpha"?"selected":""}>Alpha</option>
      </select>
      <button onclick="showScan('${s.panggilan}')">Scan Wajah</button>
    `;
    list.appendChild(div);
  });
}

function updateAbsensi(panggilan, value){
  let today = new Date().toISOString().split('T')[0];
  if(!absensiData[today]) absensiData[today]={};
  absensiData[today][panggilan]=value;
  localStorage.setItem("absensiData", JSON.stringify(absensiData));
}

// ======================
// 5️⃣ Scan Wajah
// ======================
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function initCamera(){
  navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}})
    .then(stream => video.srcObject = stream)
    .catch(err => alert("Tidak bisa mengakses kamera. Pastikan izin kamera diberikan."));
}

function ambilFoto(){
  context.drawImage(video,0,0,canvas.width,canvas.height);
  alert("Foto berhasil diambil!");
}

function showScan(panggilan){
  showTab('scan');
}

// ======================
// 6️⃣ Tugas / PR
// ======================
function renderTugas(){
  let list = document.getElementById("listTugas");
  list.innerHTML="";
  tugasData.forEach((t,i)=>{
    let li = document.createElement("li");
    li.className="tugasItem";
    li.innerHTML=`<strong>${t.nama}</strong> - Deadline: ${t.deadline} <input type="checkbox" ${t.done?"checked":""} onchange="toggleTugas(${i},this.checked)"> <button onclick="hapusTugas(${i})">Hapus</button>`;
    list.appendChild(li);
  });
}

function tambahTugas(){
  let nama = prompt("Nama tugas / PR?");
  let deadline = prompt("Deadline (YYYY-MM-DD)?");
  if(nama && deadline){
    tugasData.push({nama, deadline, done:false});
    localStorage.setItem("tugasData", JSON.stringify(tugasData));
    renderTugas();
  }
}

function hapusTugas(i){
  tugasData.splice(i,1);
  localStorage.setItem("tugasData", JSON.stringify(tugasData));
  renderTugas();
}

function toggleTugas(i,val){
  tugasData[i].done = val;
  localStorage.setItem("tugasData", JSON.stringify(tugasData));
}

// ======================
// 7️⃣ Motivasi
// ======================
function motivasiRandom(){
  let text = motivasiList[Math.floor(Math.random()*motivasiList.length)];
  document.getElementById("motivasiText").innerText=text;
}

// ======================
// 8️⃣ Kas Admin Only
// ======================
function renderKas(){
  let list = document.getElementById("kasList");
  list.innerHTML="";
  kasData.forEach((k,i)=>{
    let li = document.createElement("li");
    li.innerHTML=`${k.tanggal} - Rp ${k.nominal} - <input type="checkbox" ${k.done?"checked":""} onchange="toggleKas(${i},this.checked)">`;
    if(!isAdmin()) li.querySelector("input").disabled=true;
    list.appendChild(li);
  });
}

// Contoh admin check
function isAdmin(){
  // sementara contoh: panggilan "azam" adalah admin
  let user = document.getElementById("username").value.toLowerCase().replace(/\s/g,'');
  return user==="azam";
}

function toggleKas(i,val){
  kasData[i].done = val;
  localStorage.setItem("kasData", JSON.stringify(kasData));
}

// ======================
// 9️⃣ Calendar
// ======================
function lihatTanggal(){
  let date = document.getElementById("calendarDate").value;
  let msg = `Tanggal: ${date}\n`;
  if(absensiData[date]){
    msg += "Absensi:\n";
    for(let s in absensiData[date]){
      msg += s + " : " + absensiData[date][s] + "\n";
    }
  } else msg += "Absensi kosong\n";
  msg += "Tugas:\n";
  tugasData.forEach(t=>{
    if(t.deadline===date) msg+=t.nama+"\n";
  });
  document.getElementById("selectedDate").innerText=msg;
}

// ======================
// 10️⃣ Search Option
// ======================
function searchOption(){
  let val = document.getElementById("searchOption").value.toLowerCase();
  let options = {siswa:'siswa', absensi:'absensi', tugas:'tugas', calendar:'calendar', jadwal:'jadwal', motivasi:'motivasi', kas:'kas'};
  for(let key in options){
    let display = key.includes(val)?"block":"none";
    document.getElementById(options[key]).style.display=display;
  }
}
