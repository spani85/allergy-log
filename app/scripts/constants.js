(function () {
window.AllergyLog = window.AllergyLog || {};

window.AllergyLog.constants = {
  symptoms: [
    ["noseItching", "Prurito naso"],
    ["sneezing", "Starnuti"],
    ["runnyNose", "Naso che cola"],
    ["blockedNose", "Naso chiuso"],
    ["itchyEyes", "Prurito occhi"],
    ["wateryEyes", "Lacrimazione"]
  ],
  impacts: [
    ["disturbedSleep", "Sonno disturbato"],
    ["schoolWorkProblems", "Problemi scuola/lavoro"],
    ["bothersomeSymptoms", "Sintomi fastidiosi"],
    ["dailyActivityLimitations", "Limitazione attivita giornaliera"]
  ],
  ratings: [
    [1, "🙂"],
    [2, "😐"],
    [3, "🙁"],
    [4, "🤧"]
  ],
  defaultMedications: [
    { id: "antistaminico", name: "antistaminico" },
    { id: "foster", name: "foster" },
    { id: "oralair", name: "oralair" }
  ]
};
})();
