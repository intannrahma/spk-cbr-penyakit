
const daftarGejala = document.getElementById("daftar-gejala");
const hasil = document.getElementById("hasil");
const dataKasus = document.getElementById("data-kasus");

function tampilkanGejala() {
  daftarGejala.innerHTML = "";

  Object.entries(gejala).forEach(([kode, item], i) => {
    const label = document.createElement("label");
    label.className = "gejala-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;
    checkbox.checked = kasusBaru.gejala[i] === 1;

    const teks = document.createElement("span");
    const kodeSpan = document.createElement("span");
    kodeSpan.className = "kode";
    kodeSpan.textContent = kode;

    teks.appendChild(kodeSpan);
    teks.appendChild(document.createTextNode(item.nama));

    label.appendChild(checkbox);
    label.appendChild(teks);
    daftarGejala.appendChild(label);
  });
}

function ambilGejalaTerpilih() {
  return Array.from(
    daftarGejala.querySelectorAll('input[type="checkbox"]')
  ).map(input => input.checked ? 1 : 0);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator * 100;
}

function prosesDiagnosis() {
  const vektor = ambilGejalaTerpilih();

  if (!vektor.includes(1)) {
    hasil.innerHTML = "<p>Pilih minimal satu gejala terlebih dahulu.</p>";
    return;
  }

  const hasilHitung = Object.entries(penyakit).map(([kode, item]) => ({
    kode,
    nama: item.nama,
    nilai: cosineSimilarity(vektor, item.gejala)
  }));

  hasilHitung.sort((a, b) => b.nilai - a.nilai);

  hasil.innerHTML = "";

  const keterangan = document.createElement("p");
  keterangan.textContent =
    "Vektor kasus baru: [" + vektor.join(", ") + "]";
  hasil.appendChild(keterangan);

  hasilHitung.forEach((item, index) => {
    const kartu = document.createElement("div");
    kartu.className = "result-item" + (index === 0 ? " best" : "");

    const kepala = document.createElement("div");
    kepala.className = "result-head";

    const judul = document.createElement("h3");
    judul.textContent = item.kode + " - " + item.nama;

    const persen = document.createElement("span");
    persen.className = "percent";
    persen.textContent = item.nilai.toFixed(2) + "%";

    kepala.appendChild(judul);
    kepala.appendChild(persen);

    const bar = document.createElement("div");
    bar.className = "bar";

    const isiBar = document.createElement("div");
    isiBar.className = "bar-fill";
    isiBar.style.width = Math.min(100, item.nilai) + "%";

    bar.appendChild(isiBar);
    kartu.appendChild(kepala);
    kartu.appendChild(bar);
    hasil.appendChild(kartu);
  });
}

function tampilkanDataKasus() {
  dataKasus.innerHTML = "";

  Object.entries(penyakit).forEach(([kode, item]) => {
    const baris = document.createElement("div");
    baris.className = "case-row";
    baris.textContent =
      kode + " - " + item.nama +
      " | [" + item.gejala.join(", ") + "]";
    dataKasus.appendChild(baris);
  });
}

function resetGejala() {
  daftarGejala.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });
  hasil.innerHTML = "<p>Pilih gejala lalu tekan Proses Diagnosis.</p>";
}

document.getElementById("btn-diagnosis")
  .addEventListener("click", prosesDiagnosis);

document.getElementById("btn-reset")
  .addEventListener("click", resetGejala);

tampilkanGejala();
tampilkanDataKasus();
prosesDiagnosis();
