(function () {
const { symptoms } = window.AllergyLog.constants;
const { formatDisplayDate, formatMinutes, parseDate, symptomScore, todayIso, toIsoDate, yesNo } = window.AllergyLog.utils;

function renderCalendar({ entries, currentMonth, selectedDate, elements, onSelectDay }) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const cells = firstWeekday + daysInMonth;
  const totalCells = Math.ceil(cells / 7) * 7;

  elements.monthLabel.textContent = firstDay.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric"
  });
  elements.calendarGrid.innerHTML = "";

  for (let index = 0; index < totalCells; index += 1) {
    const day = index - firstWeekday + 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-cell";

    if (day < 1 || day > daysInMonth) {
      button.classList.add("is-empty");
      button.disabled = true;
      elements.calendarGrid.append(button);
      continue;
    }

    const date = toIsoDate(new Date(year, month, day));
    const entry = entries.find((item) => item.date === date);
    button.innerHTML = `<span class="day-number">${day}</span>`;
    button.classList.toggle("is-today", date === todayIso());
    button.classList.toggle("has-entry", Boolean(entry));
    button.classList.toggle("is-selected", date === selectedDate);
    button.addEventListener("click", () => onSelectDay(date));

    if (entry) {
      const score = symptomScore(entry, symptoms);
      button.innerHTML += `<span class="day-score"><span style="width: ${score}%"></span></span>`;
      button.setAttribute("aria-label", `${formatDisplayDate(date)}, indice sintomi ${score}`);
    } else {
      button.setAttribute("aria-label", formatDisplayDate(date));
    }

    elements.calendarGrid.append(button);
  }
}

function renderDayDetail({ entry, medications, dayDetail, onEdit, onDelete }) {
  if (!entry) {
    dayDetail.innerHTML = `
      <h2>Dettaglio</h2>
      <p class="muted">Seleziona un giorno registrato.</p>
    `;
    return;
  }

  dayDetail.innerHTML = `
    <h2>${formatDisplayDate(entry.date)}</h2>
    <div class="detail-list">
      <div class="detail-item"><span>Indice sintomi</span><strong>${symptomScore(entry, symptoms)}/100</strong></div>
      <div class="detail-item"><span>Intensita percepita</span><strong>${entry.perceivedIntensity}/100</strong></div>
      <div class="detail-item"><span>Tempo all'aperto</span><strong>${formatMinutes(entry.outdoorTimeMinutes)}</strong></div>
      <div class="detail-item"><span>Farmaci</span><strong>${yesNo(entry.tookMedication)}</strong></div>
      <div class="detail-item"><span>Farmaci presi</span><strong>${medicationNames(entry.medicationsTaken, medications) || "-"}</strong></div>
      ${symptoms.map(([key, label]) => `<div class="detail-item"><span>${label}</span><strong>${entry[key]}</strong></div>`).join("")}
    </div>
    <div class="detail-actions">
      <button class="secondary-button" type="button" id="editSelectedButton">Modifica</button>
      <button class="danger-button" type="button" id="deleteSelectedButton">Elimina</button>
    </div>
  `;

  document.getElementById("editSelectedButton").addEventListener("click", onEdit);
  document.getElementById("deleteSelectedButton").addEventListener("click", onDelete);
}

function medicationNames(ids, medications) {
  if (!Array.isArray(ids) || !ids.length) return "";
  return ids
    .map((id) => medications.find((medication) => medication.id === id)?.name || id)
    .join(", ");
}

function monthFromIsoDate(iso) {
  return parseDate(iso);
}

window.AllergyLog.calendar = {
  renderCalendar,
  renderDayDetail,
  monthFromIsoDate
};
})();
