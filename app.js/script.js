// TUNTAS - JavaScript ringan: menu HP, tab, contoh status, dan zoom diagram.

document.documentElement.classList.remove("tanpa-js");

// 1. Menu untuk layar kecil
const tombolMenu = document.querySelector(".tombol-menu");
const navigasi = document.querySelector(".navigasi");

if (tombolMenu && navigasi) {
  document.documentElement.classList.add("siap-menu");

  const aturMenu = (buka) => {
    navigasi.classList.toggle("buka", buka);
    tombolMenu.setAttribute("aria-expanded", String(buka));
    tombolMenu.textContent = buka ? "Tutup" : "Menu";
  };

  tombolMenu.addEventListener("click", () => {
    aturMenu(tombolMenu.getAttribute("aria-expanded") !== "true");
  });
  navigasi.addEventListener("click", (e) => {
    if (e.target.closest("a")) aturMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") aturMenu(false);
  });
}

// 2. Tab (fitur, contoh penerapan, wireframe)
document.querySelectorAll("[data-tabs]").forEach((grup) => {
  const tabs = Array.from(grup.querySelectorAll('[role="tab"]'));
  const daftar = grup.querySelector('[role="tablist"]');
  daftar.hidden = false;
  grup.classList.add("siap-tab");

  const pilih = (tab) => {
    tabs.forEach((t) => {
      const aktif = t === tab;
      t.setAttribute("aria-selected", String(aktif));
      t.tabIndex = aktif ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !aktif;
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => pilih(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const arah = e.key === "ArrowRight" ? 1 : -1;
      const baru = tabs[(i + arah + tabs.length) % tabs.length];
      pilih(baru);
      baru.focus();
    });
  });

  pilih(tabs[0]);
});

// 3. Contoh perjalanan status laporan di halaman utama
const demo = document.querySelector("[data-demo]");

if (demo) {
  const langkah = Array.from(demo.querySelectorAll(".jejak li"));
  const lencana = demo.querySelector("[data-lencana]");
  const keterangan = demo.querySelector("[data-keterangan]");
  const tombolLanjut = demo.querySelector("[data-lanjut]");
  const tombolTolak = demo.querySelector("[data-tolak]");

  const tahap = [
    { nama: "Menunggu Verifikasi", kelas: "s-menunggu", ket: "Laporan terkirim dan menunggu diperiksa admin." },
    { nama: "Diverifikasi", kelas: "s-verif", ket: "Admin sudah memeriksa dan menerima laporan." },
    { nama: "Sedang Diproses", kelas: "s-proses", ket: "Petugas sedang menangani masalahnya." },
    { nama: "Selesai", kelas: "s-selesai", ket: "Penanganan selesai. Warga bisa melihat hasilnya." }
  ];
  let posisi = 0;
  let ditolak = false;

  const tampilkan = () => {
    const kini = ditolak
      ? { nama: "Ditolak", kelas: "s-tolak", ket: "Admin menolak laporan dan menuliskan alasannya." }
      : tahap[posisi];

    lencana.textContent = kini.nama;
    lencana.className = "status " + kini.kelas;
    keterangan.textContent = kini.ket;

    langkah.forEach((li, i) => {
      li.textContent = ditolak && i === 1 ? "Ditolak" : tahap[i].nama;
      li.className = "";
      if (ditolak) {
        if (i === 0) li.className = "lewat";
        if (i === 1) li.className = "tolak";
      } else if (i <= posisi) {
        li.className = i === posisi ? "lewat kini" : "lewat";
      }
    });

    tombolLanjut.textContent = ditolak || posisi === tahap.length - 1 ? "Ulangi contoh" : "Lanjutkan status";
    tombolTolak.hidden = ditolak || posisi !== 0;
  };

  tombolLanjut.addEventListener("click", () => {
    if (ditolak || posisi === tahap.length - 1) {
      posisi = 0;
      ditolak = false;
    } else {
      posisi += 1;
    }
    tampilkan();
  });
  tombolTolak.addEventListener("click", () => {
    ditolak = true;
    tampilkan();
    tombolLanjut.focus();
  });

  demo.querySelector("[data-kontrol]").hidden = false;
  tampilkan();
}

// 4. Perbesar dan perkecil diagram
document.querySelectorAll("[data-diagram]").forEach((blok) => {
  const gambar = blok.querySelector("img");
  const info = blok.querySelector("output");
  const lebarAsli = Number(gambar.getAttribute("width"));
  const bingkai = blok.querySelector(".diagram");
  let skala = 1;

  const terapkan = (nilai) => {
    skala = Math.min(1.8, Math.max(0.2, nilai));
    gambar.style.width = Math.round(lebarAsli * skala) + "px";
    info.textContent = Math.round(skala * 100) + "%";
  };
  const pas = () => terapkan(Math.min(1, (bingkai.clientWidth - 32) / lebarAsli));

  blok.querySelector(".alat-diagram").hidden = false;
  blok.querySelector("[data-besar]").addEventListener("click", () => terapkan(skala + 0.2));
  blok.querySelector("[data-kecil]").addEventListener("click", () => terapkan(skala - 0.2));
  blok.querySelector("[data-pas]").addEventListener("click", pas);

  // Di layar sempit tampilkan minimal 50% agar teks tetap terbaca.
  pas();
  if (skala < 0.5) terapkan(0.5);
});
