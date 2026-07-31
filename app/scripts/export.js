(function () {
const { symptoms } = window.AllergyLog.constants;
const { assertValidEntry } = window.AllergyLog.validation;
const { downloadFile, formatMinutes, symptomScore, todayIso } = window.AllergyLog.utils;

function downloadCsv(entries) {
  const header = [
    "date",
    "nose_itching",
    "sneezing",
    "runny_nose",
    "blocked_nose",
    "itchy_eyes",
    "watery_eyes",
    "outdoor_time_minutes",
    "outdoor_time",
    "took_medication",
    "disturbed_sleep",
    "school_work_problems",
    "bothersome_symptoms",
    "daily_activity_limitations",
    "perceived_intensity",
    "symptom_score_100",
    "created_at",
    "updated_at"
  ];

  const rows = entries.map((entry) => [
    entry.date,
    entry.noseItching,
    entry.sneezing,
    entry.runnyNose,
    entry.blockedNose,
    entry.itchyEyes,
    entry.wateryEyes,
    entry.outdoorTimeMinutes,
    formatMinutes(entry.outdoorTimeMinutes),
    entry.tookMedication,
    entry.disturbedSleep,
    entry.schoolWorkProblems,
    entry.bothersomeSymptoms,
    entry.dailyActivityLimitations,
    entry.perceivedIntensity,
    symptomScore(entry, symptoms),
    entry.createdAt,
    entry.updatedAt
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  downloadFile(`allergy-log-${todayIso()}.csv`, "text/csv;charset=utf-8", csv);
}

function downloadJson(entries) {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries
  };
  downloadFile(
    `allergy-log-backup-${todayIso()}.json`,
    "application/json;charset=utf-8",
    JSON.stringify(payload, null, 2)
  );
}

function parseBackupJson(content) {
  const parsed = JSON.parse(content);
  const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
  entries.forEach(assertValidEntry);
  return entries;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

window.AllergyLog.exporters = {
  downloadCsv,
  downloadJson,
  parseBackupJson
};
})();
