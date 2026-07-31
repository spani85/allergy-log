(function () {
const { impacts, ratings, symptoms } = window.AllergyLog.constants;
const { renderCalendar, renderDayDetail, monthFromIsoDate } = window.AllergyLog.calendar;
const { renderChart } = window.AllergyLog.charts;
const { downloadCsv, downloadJson, parseBackupJson } = window.AllergyLog.exporters;
const { loadEntries, persistEntries, sortEntries } = window.AllergyLog.storage;
const { validateFormState } = window.AllergyLog.validation;
const { formatDisplayDate, formatMinutes, todayIso } = window.AllergyLog.utils;

const state = {
  entries: loadEntries(),
  symptomValues: {},
  booleanValues: {},
  visibleStep: 1,
  currentMonth: new Date(),
  selectedDate: null,
  chartMetric: "symptomScore"
};

const els = {
  todayPill: document.getElementById("todayPill"),
  entryForm: document.getElementById("entryForm"),
  entryDate: document.getElementById("entryDate"),
  entryMode: document.getElementById("entryMode"),
  symptomGrid: document.getElementById("symptomGrid"),
  outdoorTime: document.getElementById("outdoorTime"),
  impactList: document.getElementById("impactList"),
  perceivedIntensity: document.getElementById("perceivedIntensity"),
  intensityOutput: document.getElementById("intensityOutput"),
  toast: document.getElementById("toast"),
  calendarGrid: document.getElementById("calendarGrid"),
  monthLabel: document.getElementById("monthLabel"),
  dayDetail: document.getElementById("dayDetail"),
  symptomChart: document.getElementById("symptomChart"),
  chartDescription: document.getElementById("chartDescription"),
  chartSummary: document.getElementById("chartSummary"),
  statsGrid: document.getElementById("statsGrid")
};

initialize();

function initialize() {
  els.todayPill.textContent = formatDisplayDate(todayIso());
  els.entryDate.value = todayIso();
  populateOutdoorOptions();
  renderSymptoms();
  renderImpacts();
  bindEvents();
  syncFormFromDate();
  renderAll();
}

function bindEvents() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelectorAll(".step-button").forEach((button) => {
    button.addEventListener("click", () => setStep(Number(button.dataset.step)));
  });

  document.querySelectorAll("[data-chart-metric]").forEach((button) => {
    button.addEventListener("click", () => {
      state.chartMetric = button.dataset.chartMetric;
      renderCurrentChart();
    });
  });

  document.getElementById("nextStepButton").addEventListener("click", () => setStep(2));
  document.getElementById("backStepButton").addEventListener("click", () => setStep(1));
  document.getElementById("noSymptomsButton").addEventListener("click", setNoSymptoms);
  document.getElementById("noImpactSymptomsButton").addEventListener("click", setNoImpactSymptoms);
  document.getElementById("resetButton").addEventListener("click", resetForm);
  document.getElementById("prevMonthButton").addEventListener("click", () => changeMonth(-1));
  document.getElementById("nextMonthButton").addEventListener("click", () => changeMonth(1));
  document.getElementById("downloadCsvButton").addEventListener("click", handleDownloadCsv);
  document.getElementById("downloadJsonButton").addEventListener("click", () => downloadJson(state.entries));
  document.getElementById("importJsonInput").addEventListener("change", importJson);

  els.entryDate.addEventListener("change", syncFormFromDate);
  els.perceivedIntensity.addEventListener("input", () => {
    els.intensityOutput.value = els.perceivedIntensity.value;
    els.intensityOutput.textContent = els.perceivedIntensity.value;
  });

  els.entryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveForm();
  });

  document.querySelectorAll("[data-choice-group] button").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest("[data-choice-group]");
      setBoolean(group.dataset.choiceGroup, button.dataset.value === "true");
    });
  });
}

function switchView(viewId) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewId);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === viewId);
  });
  renderAll();
}

function setStep(step) {
  state.visibleStep = step;
  document.querySelectorAll(".step-button").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.step) === step);
  });
  document.querySelectorAll(".form-step").forEach((panel) => {
    panel.classList.toggle("is-active", Number(panel.dataset.stepPanel) === step);
  });
}

function populateOutdoorOptions() {
  for (let minutes = 0; minutes <= 720; minutes += 30) {
    const option = document.createElement("option");
    option.value = String(minutes);
    option.textContent = formatMinutes(minutes);
    els.outdoorTime.append(option);
  }
}

function renderSymptoms() {
  els.symptomGrid.innerHTML = "";
  symptoms.forEach(([key, label]) => {
    const card = document.createElement("section");
    card.className = "symptom-card";
    card.innerHTML = `<strong>${label}</strong>`;

    const row = document.createElement("div");
    row.className = "rating-row";
    row.dataset.symptom = key;

    ratings.forEach(([value, face]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = String(value);
      button.textContent = `${value} ${face}`;
      button.addEventListener("click", () => setSymptom(key, value));
      row.append(button);
    });

    card.append(row);
    els.symptomGrid.append(card);
  });
}

function renderImpacts() {
  els.impactList.innerHTML = "";
  impacts.forEach(([key, label]) => {
    const row = document.createElement("section");
    row.className = "impact-row";
    row.innerHTML = `<strong>${label}</strong>`;

    const choices = document.createElement("div");
    choices.className = "choice-row";
    choices.dataset.choiceGroup = key;

    [
      ["true", "Si"],
      ["false", "No"]
    ].forEach(([value, text]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = value;
      button.textContent = text;
      button.addEventListener("click", () => setBoolean(key, value === "true"));
      choices.append(button);
    });

    row.append(choices);
    els.impactList.append(row);
  });
}

function setSymptom(key, value) {
  state.symptomValues[key] = value;
  refreshSymptomButtons();
}

function setBoolean(key, value) {
  state.booleanValues[key] = value;
  refreshChoiceButtons();
}

function setNoSymptoms() {
  symptoms.forEach(([key]) => {
    state.symptomValues[key] = 1;
  });
  refreshSymptomButtons();
  toast("Sintomi impostati a 1.");
}

function setNoImpactSymptoms() {
  impacts.forEach(([key]) => {
    state.booleanValues[key] = false;
  });
  refreshChoiceButtons();
  toast("Domande impatto impostate a No.");
}

function refreshSymptomButtons() {
  document.querySelectorAll("[data-symptom]").forEach((row) => {
    const value = state.symptomValues[row.dataset.symptom];
    row.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-selected", Number(button.dataset.value) === value);
    });
  });
}

function refreshChoiceButtons() {
  document.querySelectorAll("[data-choice-group]").forEach((row) => {
    const value = state.booleanValues[row.dataset.choiceGroup];
    row.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-selected", String(value) === button.dataset.value);
    });
  });
}

function syncFormFromDate() {
  const entry = state.entries.find((item) => item.date === els.entryDate.value);
  if (entry) {
    hydrateForm(entry);
    els.entryMode.textContent = "Modifica registrazione esistente";
  } else {
    clearFormValues();
    els.entryMode.textContent = "Nuova giornata";
  }
}

function hydrateForm(entry) {
  symptoms.forEach(([key]) => {
    state.symptomValues[key] = entry[key];
  });
  impacts.forEach(([key]) => {
    state.booleanValues[key] = entry[key];
  });
  state.booleanValues.tookMedication = entry.tookMedication;
  els.outdoorTime.value = String(entry.outdoorTimeMinutes);
  els.perceivedIntensity.value = String(entry.perceivedIntensity);
  els.intensityOutput.textContent = String(entry.perceivedIntensity);
  refreshSymptomButtons();
  refreshChoiceButtons();
}

function clearFormValues() {
  state.symptomValues = {};
  state.booleanValues = {};
  els.outdoorTime.value = "0";
  els.perceivedIntensity.value = "50";
  els.intensityOutput.textContent = "50";
  refreshSymptomButtons();
  refreshChoiceButtons();
}

function resetForm() {
  const date = els.entryDate.value || todayIso();
  clearFormValues();
  els.entryDate.value = date;
  setStep(1);
}

function saveForm() {
  const validationError = validateFormState({
    date: els.entryDate.value,
    symptomValues: state.symptomValues,
    booleanValues: state.booleanValues,
    outdoorTimeMinutes: Number(els.outdoorTime.value),
    perceivedIntensity: Number(els.perceivedIntensity.value)
  });
  if (validationError) {
    toast(validationError);
    return;
  }

  const now = new Date().toISOString();
  const existing = state.entries.find((item) => item.date === els.entryDate.value);
  const entry = {
    date: els.entryDate.value,
    ...Object.fromEntries(symptoms.map(([key]) => [key, state.symptomValues[key]])),
    outdoorTimeMinutes: Number(els.outdoorTime.value),
    tookMedication: state.booleanValues.tookMedication,
    ...Object.fromEntries(impacts.map(([key]) => [key, state.booleanValues[key]])),
    perceivedIntensity: Number(els.perceivedIntensity.value),
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now
  };

  state.entries = sortEntries(state.entries.filter((item) => item.date !== entry.date).concat(entry));
  persistEntries(state.entries);
  state.currentMonth = monthFromIsoDate(entry.date);
  state.selectedDate = entry.date;
  els.entryMode.textContent = "Modifica registrazione esistente";
  renderAll();
  toast("Registrazione salvata.");
}

function changeMonth(delta) {
  state.currentMonth = new Date(
    state.currentMonth.getFullYear(),
    state.currentMonth.getMonth() + delta,
    1
  );
  renderCurrentCalendar();
}

function selectDay(date) {
  state.selectedDate = date;
  renderCurrentDayDetail();
  renderCurrentCalendar();
}

function renderAll() {
  renderCurrentCalendar();
  renderCurrentDayDetail();
  renderCurrentChart();
  renderStats();
}

function renderCurrentCalendar() {
  renderCalendar({
    entries: state.entries,
    currentMonth: state.currentMonth,
    selectedDate: state.selectedDate,
    elements: els,
    onSelectDay: selectDay
  });
}

function renderCurrentDayDetail() {
  const entry = state.entries.find((item) => item.date === state.selectedDate);
  renderDayDetail({
    entry,
    dayDetail: els.dayDetail,
    onEdit: () => editEntry(entry),
    onDelete: () => deleteEntry(entry)
  });
}

function editEntry(entry) {
  if (!entry) return;
  els.entryDate.value = entry.date;
  hydrateForm(entry);
  els.entryMode.textContent = "Modifica registrazione esistente";
  setStep(1);
  switchView("entryView");
}

function deleteEntry(entry) {
  if (!entry) return;
  if (!window.confirm(`Eliminare la registrazione del ${formatDisplayDate(entry.date)}?`)) return;
  state.entries = state.entries.filter((item) => item.date !== entry.date);
  state.selectedDate = null;
  persistEntries(state.entries);
  renderAll();
  syncFormFromDate();
  toast("Registrazione eliminata.");
}

function renderCurrentChart() {
  renderChart({
    entries: state.entries,
    metricName: state.chartMetric,
    elements: els
  });
}

function renderStats() {
  const count = state.entries.length;
  const medicationDays = state.entries.filter((entry) => entry.tookMedication).length;
  const symptomAverage = count
    ? Math.round(state.entries.reduce((sum, entry) => {
      const values = symptoms.map(([key]) => entry[key]);
      const dailyAverage = values.reduce((innerSum, value) => innerSum + value, 0) / values.length;
      return sum + Math.round(((dailyAverage - 1) / 3) * 100);
    }, 0) / count)
    : 0;

  els.statsGrid.innerHTML = `
    <section class="stat"><span>Giorni registrati</span><strong>${count}</strong></section>
    <section class="stat"><span>Media sintomi</span><strong>${symptomAverage}</strong></section>
    <section class="stat"><span>Giorni con farmaci</span><strong>${medicationDays}</strong></section>
  `;
}

function handleDownloadCsv() {
  if (!state.entries.length) {
    toast("Nessun dato da esportare.");
    return;
  }
  downloadCsv(state.entries);
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      state.entries = sortEntries(parseBackupJson(String(reader.result)));
      persistEntries(state.entries);
      renderAll();
      syncFormFromDate();
      toast("Backup importato.");
    } catch (error) {
      toast("JSON non valido per questa app.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(toast.timeout);
  toast.timeout = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, 2600);
}
})();
