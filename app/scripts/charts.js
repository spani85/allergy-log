(function () {
const { symptoms } = window.AllergyLog.constants;
const { formatDisplayDate, symptomScore } = window.AllergyLog.utils;

function renderChart({ entries, metricName, elements }) {
  const latest = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30).reverse();
  if (!latest.length) {
    elements.symptomChart.innerHTML = `<p class="muted">Nessun dato registrato.</p>`;
    elements.chartSummary.innerHTML = "";
    return;
  }

  const metric = getChartMetric(metricName);
  document.querySelectorAll("[data-chart-metric]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.chartMetric === metricName);
  });
  elements.chartDescription.textContent = metric.description;
  renderChartSummary(latest, metric, elements.chartSummary);

  elements.symptomChart.innerHTML = `
    <div class="xy-chart" style="--bar-count: ${latest.length}">
      <div class="y-axis" aria-hidden="true">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>
      <div class="plot-area">
        ${latest.map((entry) => {
          const score = metric.value(entry);
          return `
            <div class="plot-bar" title="${formatDisplayDate(entry.date)}: ${score}" style="--bar-value: ${score}">
              <span class="plot-bar-value">${score}</span>
              <span class="plot-bar-fill" style="height: ${score}%"></span>
            </div>
          `;
        }).join("")}
      </div>
      <div class="x-axis" aria-hidden="true">
        ${latest.map((entry) => `<span>${entry.date.slice(5)}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderChartSummary(entries, metric, chartSummary) {
  const values = entries.map(metric.value);
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const maxEntry = entries[values.indexOf(max)];

  chartSummary.innerHTML = `
    <section class="chart-summary-item"><span>Giorni nel grafico</span><strong>${entries.length}</strong></section>
    <section class="chart-summary-item"><span>Media</span><strong>${average}</strong></section>
    <section class="chart-summary-item"><span>Minimo</span><strong>${min}</strong></section>
    <section class="chart-summary-item"><span>Picco</span><strong>${max}</strong><span>${formatDisplayDate(maxEntry.date)}</span></section>
  `;
}

function getChartMetric(metricName) {
  if (metricName === "perceivedIntensity") {
    return {
      description: "Valore soggettivo impostato con lo slider da 0 a 100.",
      value: (entry) => entry.perceivedIntensity
    };
  }

  return {
    description: "Indice calcolato dalla media dei 6 sintomi principali.",
    value: (entry) => symptomScore(entry, symptoms)
  };
}

window.AllergyLog.charts = {
  renderChart
};
})();
