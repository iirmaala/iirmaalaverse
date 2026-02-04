// ===== DATA =====
let siswa = [
  "Agha Muhammad Azam Ar-Rosyid",
  "Aldiansah Arga Pratama",
  "Fahad Ahmad Alamudi",
  "Intan Nirmalasari Salabila Roskiani",
  "Mohammad Farid Syaifulloh",
  "Mohammad Musyafa Akbar",
  "Muhammad Irfan Arisaputra Islahudin",
  "Muhammad Michael Al-Muhith",
  "Naila Rheisy Admaja Veaka",
  "Salma Larissa Indrasari"
];

// Jadwal Pelajaran
let jadwalPelajaran = {
  Senin: ["Geografi","Matematika","Bahasa Indonesia","Seni Rupa","Biologi"],
  Selasa: ["Bahasa Jawa","Sejarah","Kemuhammadiyahan","Informatika","Geografi","Ekonomi"],
  Rabu: ["Penjaskes","Bahasa Arab","PAI","Ekonomi"],
  Kamis: ["Biologi","Bahasa Indonesia","PAI","Bahasa Inggris","Sosiologi"],
  Jumat: ["PPKN","BK","Matematika","Sosiologi"]
// Keterangan
let keterangan = {
  Rabu: ["Double Track"],
  Kamis: ["Hizbul Wathan"],
  Jumat: ["Tapak Suci"]
};

// Jadwal Piket
let jadwalPiket = {
  Senin: ["Azam","Salma"],
  Selasa: ["Farid","Musyafa"],
  Rabu: ["Michael","Irma"],
  Kamis: ["Fahad","Rheisy"],
  Jumat: ["Arga","Irfan"]
};

// Tugas
let tugas = JSON.parse(localStorage.getItem("tugas")) || [];

// Absensi
let absensi = JSON.parse(localStorage.getItem("absensi")) || {};

// Kas
let kas = JSON.parse(localStorage.getItem("kas")) || {};

// Motivasi
let motivasiList = [
  "Semangat pagi, semoga hari ini penuh prestasi 🌸",
  "Kamu bisa, terus berusaha 💜",
  "Setiap hari adalah kesempatan baru untuk belajar ✨",
  "Jangan menyerah, sukses menunggu di depan 🚀"
];

// Admin
let adminUser = "admineleventwolighthouse";
let adminPass = "112rumahbercahaya";

// ===== LOGIN =====
function login(){
  let u = document.getElementById("username").value.toLowerCase().replace(/\s+/g,'');
  let p = document.getElementById("password").value.toLowerCase().replace(/\s+/g,'');
  if((siswa.map(s=>s.split(" ")[0].toLowerCase()).includes(u) && p) || (u===adminUser && p===adminPass)){
    document.getElementById("loginSection").style.display="none";
    document.getElementById("appSection").style.display="block";
    renderSiswa();
    renderTugas();
    renderJadwal();
    pengingatPiket();
    motivasiRandom();
    loadKas();
    initCamera();
  } else {
    document.getElementById("loginMsg").innerText="Username/Password salah!";
  }
}

function logout(){
  document.getElementById("appSection").style.display="none";
  document.getElementById("loginSection").style.display="block";
}

// ===== TAB =====
function showTab(tab){
  let tabs = document.querySelectorAll(".tabContent");
  tabs.forEach(t=>t.style.display="none");
  document.getElementById(tab).style.display="block";
  document.querySelectorAll(".tabBtn").forEach(b=>b.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

// ===== SISWA =====
function renderSiswa(){
  let ul = document.getElementById("daftarSiswa");
  ul.innerHTML="";
  siswa.forEach(s=>{
    let li=document.createElement("li");
    li.innerText=s;
    ul.appendChild(li);
  });
}

function searchSiswa(){
  let q=document.getElementById("searchSiswa").value.toLowerCase();
  document.querySelectorAll("#daftarSiswa li").forEach(li=>{
    li.style.display=li.innerText.toLowerCase().includes(q)?"block":"none";
  });
}

// ===== TUGAS =====
function renderTugas(){
  let ul = document.getElementById("listTugas");
  ul.innerHTML="";
  tugas.forEach((t,i)=>{
    let li=document.createElement("li");
    li.className="tugasItem";
    li.innerHTML=`${t.nama} - ${t.deadline} <input type="checkbox" onchange="toggleTugas(${i})" ${t.done?"checked":""}>`;
    ul.appendChild(li);
  });
  localStorage.setItem("tugas",JSON.stringify(tugas));
}

function tambahTugas(){
  let nama = prompt("Nama tugas:");
  let deadline = prompt("Deadline (YYYY-MM-DD):");
  if(nama && deadline){tugas.push({nama,deadline,done:false}); renderTugas();}
}

function toggleTugas(i){
  tugas[i].done = !tugas[i].done;
  renderTugas();
}

// ===== JADWAL & PIKET =====
function renderJadwal(){
  let container = document.getElementById("jadwalList");
  container.innerHTML="";
  Object.keys(jadwalPelajaran).forEach(hari=>{
    let div = document.createElement("div");
    div.className="jadwalItem";
    let pelajaran = jadwalPelajaran[hari].join(", ");
    let piket = jadwalPiket[hari].join(", ");
    div.innerHTML=`<strong>${hari.toUpperCase()}</strong><br>Pelajaran: ${pelajaran}<br>Piket: ${piket} <button onclick="ceklisPiket('${hari}')">Ceklis Piket</button>`;
    container.appendChild(div);
  });
}

function isAdmin(){ return document.getElementById("username").value.toLowerCase()===adminUser; }

function ceklisPiket(hari){
  if(!isAdmin()){alert("Hanya admin bisa ceklis!"); return;}
  kas[hari]="ceklist";
  localStorage.setItem("kas",JSON.stringify(kas));
  alert("Piket hari "+hari+" diceklis ✅");
}

function pengingatPiket(){
  let today = new Date().toLocaleDateString('id-ID',{weekday:'long'}).toLowerCase();
  if(jadwalPiket[today] && !kas[today]) alert("Pengingat: Piket hari ini ("+today+") belum diceklis!");
}

// ===== MOTIVASI =====
function motivasiRandom(){
  let text = motivasiList[Math.floor(Math.random()*motivasiList.length)];
  document.getElementById("motivasiText").innerText=text;
}

// ===== KAS =====
function loadKas(){
  let ul=document.getElementById("kasList");
  ul.innerHTML="";
  for(let k in kas){ let li=document.createElement("li"); li.innerText=k+": "+kas[k]; ul.appendChild(li);}
}

// ===== CAMERA =====
function initCamera(){
  let video=document.getElementById("video");
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{video.srcObject=stream;}).catch(e=>{alert("Kamera tidak aktif!");});
  }
}
function ambilFoto(){
  let video=document.getElementById("video");
  let canvas=document.getElementById("canvas");
  let ctx=canvas.getContext("2d");
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  alert("Foto berhasil diambil ✅");
}

// ===== SEARCH OPTIONS =====
function searchOption(){
  let q=document.getElementById("searchOption").value.toLowerCase();
  document.querySelectorAll(".tabBtn").forEach(b=>{
    b.style.display=b.innerText.toLowerCase().includes(q)?"inline-block":"none";
  });
}

// ===== ABSENSI =====
function renderAbsensi(){
  let container=document.getElementById("absensiList");
  container.innerHTML="";
  siswa.forEach(s=>{
    let div=document.createElement("div");
    div.className="absensiItem";
    div.innerHTML=`${s} <select onchange="updateAbsensi('${s}',this.value)">
      <option value="">--Pilih--</option>
      <option value="Hadir">Hadir</option>
      <option value="Izin">Izin</option>
      <option value="Sakit">Sakit</option>
      <option value="Alpha">Alpha</option>
    </select>`;
    container.appendChild(div);
  });
}

function updateAbsensi(s,name){
  let today=new Date().toISOString().slice(0,10);
  if(!absensi[today]) absensi[today]={};
  absensi[today][s]=name;
  localStorage.setItem("absensi",JSON.stringify(absensi));
}

renderAbsensi();
