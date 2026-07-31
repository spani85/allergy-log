(function () {
window.AllergyLog = window.AllergyLog || {};

function todayIso() {
  return toIsoDate(new Date());
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDisplayDate(iso) {
  return parseDate(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatMinutes(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function yesNo(value) {
  return value ? "Si" : "No";
}

function symptomScore(entry, symptoms) {
  const average = symptoms.reduce((sum, [key]) => sum + entry[key], 0) / symptoms.length;
  return Math.round(((average - 1) / 3) * 100);
}

function downloadFile(filename, type, content) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

window.AllergyLog.utils = {
  todayIso,
  toIsoDate,
  parseDate,
  formatDisplayDate,
  formatMinutes,
  yesNo,
  symptomScore,
  downloadFile
};
})();
