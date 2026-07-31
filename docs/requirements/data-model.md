# Modello dati ed export

## Entita' principale

Una registrazione rappresenta una giornata.

Identificatore naturale: `date` in formato ISO `YYYY-MM-DD`.

In prima versione ha senso avere al massimo una registrazione per giorno.

## Campi

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `date` | string | si | Formato `YYYY-MM-DD` |
| `noseItching` | integer | si | Da 1 a 4 |
| `sneezing` | integer | si | Da 1 a 4 |
| `runnyNose` | integer | si | Da 1 a 4 |
| `blockedNose` | integer | si | Da 1 a 4 |
| `itchyEyes` | integer | si | Da 1 a 4 |
| `wateryEyes` | integer | si | Da 1 a 4 |
| `outdoorTimeMinutes` | integer | si | Da 0 a 720, step 30 |
| `tookMedication` | boolean | si | Farmaci allergia |
| `disturbedSleep` | boolean | si | Sonno disturbato |
| `schoolWorkProblems` | boolean | si | Problemi scuola/lavoro |
| `bothersomeSymptoms` | boolean | si | Sintomi fastidiosi |
| `dailyActivityLimitations` | boolean | si | Limitazione attivita' |
| `perceivedIntensity` | integer | si | Da 0 a 100 |
| `createdAt` | string | si | Timestamp ISO |
| `updatedAt` | string | si | Timestamp ISO |

## Indice calcolato di gravita'

Per visualizzare barre e colori nel calendario si puo' calcolare un indice derivato dai 6 sintomi principali.

Formula proposta:

```text
symptomAverage = average([
  noseItching,
  sneezing,
  runnyNose,
  blockedNose,
  itchyEyes,
  wateryEyes
])

symptomScore100 = round(((symptomAverage - 1) / 3) * 100)
```

Interpretazione:

- `0`: tutti i sintomi a 1;
- `100`: tutti i sintomi a 4;
- valori intermedi proporzionali alla media.

Questo valore non deve sostituire `perceivedIntensity`: uno e' calcolato dai sintomi, l'altro e' soggettivo.

## CSV

Il CSV deve esportare sia i dati grezzi sia alcuni campi calcolati.

Colonne proposte:

```text
date,nose_itching,sneezing,runny_nose,blocked_nose,itchy_eyes,watery_eyes,outdoor_time_minutes,outdoor_time,took_medication,disturbed_sleep,school_work_problems,bothersome_symptoms,daily_activity_limitations,perceived_intensity,symptom_score_100,created_at,updated_at
```

## JSON

Il JSON e' utile per backup e ripristino senza perdita di informazione.

Struttura proposta:

```json
{
  "version": 1,
  "exportedAt": "2026-07-31T12:00:00.000Z",
  "entries": []
}
```

## Note privacy

I dati del diario allergologico sono dati personali e potenzialmente sanitari.

In una versione solo statica con `localStorage`, i dati restano nel browser del dispositivo. Questo e' semplice, ma ha due limiti:

- se il browser cancella i dati locali, il diario puo' andare perso;
- i dati non si sincronizzano automaticamente tra telefono e computer.

Per questo l'export JSON dovrebbe essere previsto presto come backup manuale.

