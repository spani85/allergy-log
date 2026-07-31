(function () {
  const STORAGE_KEY = "allergy-log.entries.v1";

  const symptoms = [
    ["noseItching", "Prurito naso"],
    ["sneezing", "Starnuti"],
    ["runnyNose", "Naso che cola"],
    ["blockedNose", "Naso chiuso"],
    ["itchyEyes", "Prurito occhi"],
    ["wateryEyes", "Lacrimazione"]
  ];

  const impacts = [
    ["disturbedSleep", "Sonno disturbato"],
    ["schoolWorkProblems", "Problemi scuola/lavoro"],
    ["bothersomeSymptoms", "Sintomi fastidiosi"],
    ["dailyActivityLimitations", "Limitazione attivita giornaliera"]
  ];

  const ratings = [
    [1, ":)"],
    [2, ":|"],
    [3, ":("],
    [4, ":'("]
  ];

  const state = {
    entries: loadEntries(),
    symptomValues: {},
    booleanValues: {},
    visibleStep: 1,
    currentMonth: new Date(),
    selectedDate: null
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

    document.getElementById("nextStepButton").addEventListener("click", () => setStep(2));
    document.getElementById("backStepButton").addEventListener("click", () => setStep(1));
    document.getElementById("noSymptomsButton").addEventListener("click", setNoSymptoms);
    document.getElementById("resetButton").addEventListener("click", resetForm);
    document.getElementById("prevMonthButton").addEventListener("click", () => changeMonth(-1));
    document.getElementById("nextMonthButton").addEventListener("click", () => changeMonth(1));
    document.getElementById("downloadCsvButton").addEventListener("click", downloadCsv);
    document.getElementById("downloadJsonButton").addEventListener("click", downloadJson);
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
    const validationError = validateForm();
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

    state.entries = state.entries.filter((item) => item.date !== entry.date);
    state.entries.push(entry);
    state.entries.sort((a, b) => a.date.localeCompare(b.date));
    persistEntries();
    state.currentMonth = parseDate(entry.date);
    state.selectedDate = entry.date;
    els.entryMode.textContent = "Modifica registrazione esistente";
    renderAll();
    toast("Registrazione salvata.");
  }

  function validateForm() {
    if (!els.entryDate.value) return "Scegli una data.";
    const missingSymptom = symptoms.find(([key]) => !state.symptomValues[key]);
    if (missingSymptom) return `Manca: ${missingSymptom[1]}.`;
    if (state.booleanValues.tookMedication === undefined) return "Indica se hai preso farmaci.";
    const missingImpact = impacts.find(([key]) => state.booleanValues[key] === undefined);
    if (missingImpact) return `Manca: ${missingImpact[1]}.`;
    return "";
  }

  function changeMonth(delta) {
    state.currentMonth = new Date(
      state.currentMonth.getFullYear(),
      state.currentMonth.getMonth() + delta,
      1
    );
    renderCalendar();
  }

  function renderAll() {
    renderCalendar();
    renderChart();
    renderStats();
  }

  function renderCalendar() {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const cells = firstWeekday + daysInMonth;
    const totalCells = Math.ceil(cells / 7) * 7;

    els.monthLabel.textContent = firstDay.toLocaleDateString("it-IT", {
      month: "long",
      year: "numeric"
    });
    els.calendarGrid.innerHTML = "";

    for (let index = 0; index < totalCells; index += 1) {
      const day = index - firstWeekday + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-cell";

      if (day < 1 || day > daysInMonth) {
        button.classList.add("is-empty");
        button.disabled = true;
        els.calendarGrid.append(button);
        continue;
      }

      const date = toIsoDate(new Date(year, month, day));
      const entry = state.entries.find((item) => item.date === date);
      button.innerHTML = `<span class="day-number">${day}</span>`;
      button.classList.toggle("is-today", date === todayIso());
      button.classList.toggle("has-entry", Boolean(entry));
      button.addEventListener("click", () => selectDay(date));

      if (entry) {
        const score = symptomScore(entry);
        button.innerHTML += `<span class="day-score"><span style="width: ${score}%"></span></span>`;
        button.setAttribute("aria-label", `${formatDisplayDate(date)}, indice sintomi ${score}`);
      } else {
        button.setAttribute("aria-label", formatDisplayDate(date));
      }

      els.calendarGrid.append(button);
    }

    renderDayDetail();
  }

  function selectDay(date) {
    state.selectedDate = date;
    renderDayDetail();
  }

  function renderDayDetail() {
    const date = state.selectedDate;
    const entry = state.entries.find((item) => item.date === date);
    if (!entry) {
      els.dayDetail.innerHTML = `
        <h2>Dettaglio</h2>
        <p class="muted">Seleziona un giorno registrato.</p>
      `;
      return;
    }

    els.dayDetail.innerHTML = `
      <h2>${formatDisplayDate(entry.date)}</h2>
      <div class="detail-list">
        <div class="detail-item"><span>Indice sintomi</span><strong>${symptomScore(entry)}/100</strong></div>
        <div class="detail-item"><span>Intensita percepita</span><strong>${entry.perceivedIntensity}/100</strong></div>
        <div class="detail-item"><span>Tempo all'aperto</span><strong>${formatMinutes(entry.outdoorTimeMinutes)}</strong></div>
        <div class="detail-item"><span>Farmaci</span><strong>${yesNo(entry.tookMedication)}</strong></div>
        ${symptoms.map(([key, label]) => `<div class="detail-item"><span>${label}</span><strong>${entry[key]}</strong></div>`).join("")}
      </div>
      <div class="detail-actions">
        <button class="secondary-button" type="button" id="editSelectedButton">Modifica</button>
        <button class="danger-button" type="button" id="deleteSelectedButton">Elimina</button>
      </div>
    `;

    document.getElementById("editSelectedButton").addEventListener("click", () => {
      els.entryDate.value = entry.date;
      hydrateForm(entry);
      els.entryMode.textContent = "Modifica registrazione esistente";
      setStep(1);
      switchView("entryView");
    });

    document.getElementById("deleteSelectedButton").addEventListener("click", () => {
      if (!window.confirm(`Eliminare la registrazione del ${formatDisplayDate(entry.date)}?`)) return;
      state.entries = state.entries.filter((item) => item.date !== entry.date);
      state.selectedDate = null;
      persistEntries();
      renderAll();
      syncFormFromDate();
      toast("Registrazione eliminata.");
    });
  }

  function renderChart() {
    const latest = [...state.entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30).reverse();
    if (!latest.length) {
      els.symptomChart.innerHTML = `<p class="muted">Nessun dato registrato.</p>`;
      return;
    }

    els.symptomChart.innerHTML = latest.map((entry) => {
      const score = symptomScore(entry);
      return `
        <div class="chart-row">
          <span>${entry.date.slice(5)}</span>
          <span class="bar-track"><span class="bar-fill" style="width: ${score}%"></span></span>
          <strong>${score}</strong>
        </div>
      `;
    }).join("");
  }

  function renderStats() {
    const count = state.entries.length;
    const averageScore = count
      ? Math.round(state.entries.reduce((sum, entry) => sum + symptomScore(entry), 0) / count)
      : 0;
    const medicationDays = state.entries.filter((entry) => entry.tookMedication).length;

    els.statsGrid.innerHTML = `
      <section class="stat"><span>Giorni registrati</span><strong>${count}</strong></section>
      <section class="stat"><span>Media sintomi</span><strong>${averageScore}</strong></section>
      <section class="stat"><span>Giorni con farmaci</span><strong>${medicationDays}</strong></section>
    `;
  }

  function downloadCsv() {
    if (!state.entries.length) {
      toast("Nessun dato da esportare.");
      return;
    }

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

    const rows = state.entries.map((entry) => [
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
      symptomScore(entry),
      entry.createdAt,
      entry.updatedAt
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");

    downloadFile(`allergy-log-${todayIso()}.csv`, "text/csv;charset=utf-8", csv);
  }

  function downloadJson() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: state.entries
    };
    downloadFile(
      `allergy-log-backup-${todayIso()}.json`,
      "application/json;charset=utf-8",
      JSON.stringify(payload, null, 2)
    );
  }

  function importJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
        entries.forEach(assertValidEntry);
        state.entries = entries.sort((a, b) => a.date.localeCompare(b.date));
        persistEntries();
        renderAll();
        syncFormFromDate();
        toast("Backup importato.");
      } catch (error) {
        toast("JSON non valido per questo prototipo.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function assertValidEntry(entry) {
    if (!entry || typeof entry.date !== "string") throw new Error("missing date");
    symptoms.forEach(([key]) => {
      if (![1, 2, 3, 4].includes(entry[key])) throw new Error(`bad ${key}`);
    });
    impacts.forEach(([key]) => {
      if (typeof entry[key] !== "boolean") throw new Error(`bad ${key}`);
    });
    if (typeof entry.tookMedication !== "boolean") throw new Error("bad medication");
    if (typeof entry.perceivedIntensity !== "number") throw new Error("bad intensity");
  }

  function symptomScore(entry) {
    const average = symptoms.reduce((sum, [key]) => sum + entry[key], 0) / symptoms.length;
    return Math.round(((average - 1) / 3) * 100);
  }

  function loadEntries() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function persistEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
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

  function csvCell(value) {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }

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

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toast.timeout);
    toast.timeout = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 2600);
  }
})();
