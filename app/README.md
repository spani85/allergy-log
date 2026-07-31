# Allergy Log App

Prima versione statica dell'app.

## Come provarla

Apri `app/index.html` in un browser.

Questa versione non richiede build, dipendenze o server locale.

## Struttura

```text
app/
  index.html
  styles/
    main.css
  scripts/
    app.js
    calendar.js
    charts.js
    constants.js
    export.js
    storage.js
    utils.js
    validation.js
```

Gli script sono separati ma caricati come JavaScript classico, non come ES modules, per funzionare anche aprendo il file direttamente da `file://`.

## Funzioni incluse

- registrazione giornaliera in due passaggi;
- azioni rapide `Nessun sintomo`;
- salvataggio in `localStorage`;
- calendario mensile;
- dettaglio giorno;
- modifica ed eliminazione;
- grafico X/Y con barre verticali;
- export CSV;
- export JSON;
- import JSON.

## Nota dati

I dati restano nel browser. Per uso reale, esportare periodicamente il backup JSON.

