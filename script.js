let donghuaList = JSON.parse(localStorage.getItem("donghuaList")) || [];
let sortConfig = { key: "", direction: "asc" };

function openModal(editIndex = null) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  document.getElementById("donghuaForm").reset();
  document.getElementById("editIndex").value = "";

  if (editIndex !== null) {
    const item = donghuaList[editIndex];
    document.getElementById("judulInput").value = item.judul;
    document.getElementById("statusInput").value = item.status;
    document.getElementById("episodeInput").value = item.episode;
    document.getElementById("editIndex").value = editIndex;
    document.getElementById("modalTitle").innerText = "Edit Donghua";
  } else {
    document.getElementById("modalTitle").innerText = "Tambah Donghua";
  }

  // Fokus ke judul otomatis
  setTimeout(() => {
    document.getElementById("judulInput").focus();
  }, 100);
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function saveDonghua(e) {
  e.preventDefault();
  const judul = document.getElementById("judulInput").value;
  const status = document.getElementById("statusInput").value;
  const episode = document.getElementById("episodeInput").value;
  const editIndex = document.getElementById("editIndex").value;

  const now = new Date();
  const date = now.toLocaleString("id-ID");

  if (editIndex !== "") {
    donghuaList[editIndex] = { date, judul, status, episode };
  } else {
    donghuaList.push({ date, judul, status, episode });
  }

  localStorage.setItem("donghuaList", JSON.stringify(donghuaList));
  closeModal();
  renderTable();
}

function deleteDonghua(index) {
  if (confirm("Hapus data ini?")) {
    donghuaList.splice(index, 1);
    localStorage.setItem("donghuaList", JSON.stringify(donghuaList));
    renderTable();
  }
}

function refreshTable() {
  renderTable();
}

function exportCSV() {
  const header = ["Tanggal", "Judul", "Status", "Episode"];
  const rows = donghuaList.map(item => [item.date, item.judul, item.status, item.episode]);
  let csvContent = "data:text/csv;charset=utf-8," + header.join(",") + "\n";
  rows.forEach(row => { csvContent += row.join(",") + "\n"; });

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "donghua.csv");
  document.body.appendChild(link);
  link.click();
}

function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(donghuaList, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", "donghua.json");
  document.body.appendChild(link);
  link.click();
}

function sortTable(key) {
  let direction = "asc";
  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }
  sortConfig = { key, direction };

  donghuaList.sort((a, b) => {
    let valA = a[key], valB = b[key];
    if (key === "date") {
      valA = new Date(a.date.split("/").reverse().join("-"));
      valB = new Date(b.date.split("/").reverse().join("-"));
    }
    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#donghuaTable tbody");
  tbody.innerHTML = "";

  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("statusFilter").value;

  donghuaList
    .filter(item => item.judul.toLowerCase().includes(search))
    .filter(item => filter === "All" || item.status === filter)
    .forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.date}</td>
        <td>${item.judul}</td>
        <td class="${item.status === "Ongoing" ? "status-ongoing" : "status-selesai"}">${item.status}</td>
        <td>${item.episode}</td>
        <td>
          <button onclick="openModal(${index})">Edit</button>
          <button onclick="deleteDonghua(${index})" style="background:#dc2626;">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

// Render pertama kali
renderTable();
