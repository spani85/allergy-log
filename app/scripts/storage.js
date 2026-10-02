(function () {
const STORAGE_KEY = "allergy-log.entries.v1";
const MEDICATIONS_STORAGE_KEY = "allergy-log.medications.v1";

window.AllergyLog = window.AllergyLog || {};

function loadEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? sortEntries(parsed.map(normalizeEntry)) : [];
  } catch (error) {
    return [];
  }
}

function persistEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortEntries(entries.map(normalizeEntry))));
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

function loadMedications(defaultMedications) {
  try {
    const parsed = JSON.parse(localStorage.getItem(MEDICATIONS_STORAGE_KEY) || "null");
    if (Array.isArray(parsed) && parsed.length) return sortMedications(parsed);
  } catch (error) {
    // Ignore invalid local data and restore defaults below.
  }
  persistMedications(defaultMedications);
  return sortMedications(defaultMedications);
}

function persistMedications(medications) {
  localStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(sortMedications(medications)));
}

function sortMedications(medications) {
  return [...medications].sort((a, b) => a.name.localeCompare(b.name, "it"));
}

function normalizeEntry(entry) {
  const medicationsTaken = Array.isArray(entry.medicationsTaken)
    ? entry.medicationsTaken
    : [];
  return {
    ...entry,
    medicationsTaken,
    tookMedication: typeof entry.tookMedication === "boolean" ? entry.tookMedication : medicationsTaken.length > 0
  };
}

window.AllergyLog.storage = {
  loadEntries,
  loadMedications,
  persistEntries,
  persistMedications,
  sortEntries
};
})();
