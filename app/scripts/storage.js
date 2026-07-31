(function () {
const STORAGE_KEY = "allergy-log.entries.v1";

window.AllergyLog = window.AllergyLog || {};

function loadEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? sortEntries(parsed) : [];
  } catch (error) {
    return [];
  }
}

function persistEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortEntries(entries)));
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

window.AllergyLog.storage = {
  loadEntries,
  persistEntries,
  sortEntries
};
})();
