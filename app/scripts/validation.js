(function () {
const { impacts, symptoms } = window.AllergyLog.constants;

function validateFormState({ date, symptomValues, booleanValues, outdoorTimeMinutes, perceivedIntensity, medicationsTaken, medications }) {
  if (!date) return "Scegli una data.";

  const missingSymptom = symptoms.find(([key]) => !symptomValues[key]);
  if (missingSymptom) return `Manca: ${missingSymptom[1]}.`;

  if (!isValidOutdoorTime(outdoorTimeMinutes)) return "Tempo all'aperto non valido.";
  if (booleanValues.tookMedication === undefined) return "Indica se hai preso farmaci.";
  if (booleanValues.tookMedication && !medicationsTaken.length) return "Specifica almeno un farmaco.";
  if (medicationsTaken.some((id) => !medications.some((medication) => medication.id === id))) {
    return "La lista farmaci contiene un valore non valido.";
  }

  const missingImpact = impacts.find(([key]) => booleanValues[key] === undefined);
  if (missingImpact) return `Manca: ${missingImpact[1]}.`;

  if (!Number.isInteger(perceivedIntensity) || perceivedIntensity < 0 || perceivedIntensity > 100) {
    return "Intensita percepita non valida.";
  }

  return "";
}

function assertValidEntry(entry) {
  if (!entry || typeof entry.date !== "string") throw new Error("missing date");

  symptoms.forEach(([key]) => {
    if (![1, 2, 3, 4].includes(entry[key])) throw new Error(`bad ${key}`);
  });

  if (!isValidOutdoorTime(entry.outdoorTimeMinutes)) throw new Error("bad outdoor time");
  if (typeof entry.tookMedication !== "boolean") throw new Error("bad medication");
  if (!Array.isArray(entry.medicationsTaken)) entry.medicationsTaken = [];

  impacts.forEach(([key]) => {
    if (typeof entry[key] !== "boolean") throw new Error(`bad ${key}`);
  });

  if (!Number.isInteger(entry.perceivedIntensity) || entry.perceivedIntensity < 0 || entry.perceivedIntensity > 100) {
    throw new Error("bad intensity");
  }
}

function isValidOutdoorTime(value) {
  return Number.isInteger(value) && value >= 0 && value <= 720 && value % 30 === 0;
}

window.AllergyLog.validation = {
  validateFormState,
  assertValidEntry
};
})();
