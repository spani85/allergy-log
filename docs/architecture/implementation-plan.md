# Piano implementazione

## Scelta proposta

Implementare la prima versione reale come applicazione statica vanilla.

Struttura proposta:

```text
app/
  index.html
  styles/
    main.css
  scripts/
    app.js
    state.js
    storage.js
    validation.js
    calendar.js
    charts.js
    export.js
  manifest.webmanifest
  service-worker.js
docs/
prototype/
```

La cartella `prototype/` resta come riferimento temporaneo e puo' essere rimossa quando `app/` copre le stesse funzioni.

## Perche' vanilla

Il progetto ha una superficie contenuta:

- una form in due passaggi;
- calendario;
- grafico;
- export/import;
- storage locale.

Un framework non e' necessario nella prima versione e introdurrebbe:

- build;
- dipendenze;
- aggiornamenti;
- maggiore complessita' di deploy.

Vanilla e' coerente con l'obiettivo: app personale, statica, leggera e facile da aprire.

## Moduli

### `state.js`

Gestisce lo stato corrente dell'app:

- registrazioni caricate;
- data selezionata;
- mese corrente del calendario;
- step corrente della form;
- metrica selezionata nel grafico.

### `storage.js`

Gestisce persistenza locale:

- lettura dati;
- scrittura dati;
- chiave storage;
- versione schema;
- eventuali migrazioni.

### `validation.js`

Contiene regole di validazione:

- campi obbligatori;
- sintomi da 1 a 4;
- intensita' da 0 a 100;
- tempo all'aperto da 0 a 720 minuti con step 30;
- booleani obbligatori.

### `calendar.js`

Renderizza:

- griglia mensile;
- evidenza giorni registrati;
- dettaglio giorno;
- azioni modifica/elimina.

### `charts.js`

Renderizza grafico X/Y custom:

- asse X per giorni;
- asse Y da 0 a 100;
- barre verticali;
- toggle metrica.

La libreria grafica non serve nella prima versione. Si puo' rivalutare se serviranno serie multiple, tooltip avanzati, zoom o confronto periodi.

### `export.js`

Gestisce:

- CSV;
- JSON backup;
- JSON import;
- sanitizzazione celle CSV.

## Milestone

### Milestone 1 - App statica reale

Stato: avviata.

Obiettivo: portare il prototipo in `app/` con codice piu' ordinato.

Include:

- UI equivalente al prototipo;
- storage locale;
- validazione;
- calendario;
- grafico;
- CSV;
- JSON export/import.

Prima struttura realizzata:

```text
app/
  index.html
  robots.txt
  styles/main.css
  scripts/app.js
  scripts/calendar.js
  scripts/charts.js
  scripts/constants.js
  scripts/export.js
  scripts/storage.js
  scripts/utils.js
  scripts/validation.js
```

Nota tecnica: gli script sono caricati come JavaScript classico, non come ES modules, per permettere il test diretto aprendo `app/index.html` senza server locale.

Deploy GitHub Pages configurato:

```text
.github/workflows/pages.yml
```

Il workflow pubblica solo `app/` tramite GitHub Actions.

### Milestone 2 - Robustezza mobile

Obiettivo: renderla comoda da usare davvero sul telefono.

Include:

- layout mobile rifinito;
- controlli piu' grandi dove serve;
- stati vuoti migliori;
- messaggi errore/successo piu' chiari;
- controllo accessibilita' base.

### Milestone 3 - PWA leggera

Obiettivo: installazione su smartphone e uso offline.

Include:

- `manifest.webmanifest`;
- icone;
- service worker minimale;
- cache dei file statici;
- nota chiara su dati locali e backup.

### Milestone 4 - Rifiniture dati

Obiettivo: ridurre rischio perdita dati.

Include:

- import JSON piu' guidato;
- conferma prima di sovrascrivere dati;
- eventuale merge dati importati;
- esportazione automatica suggerita;
- documentazione backup.

## Criteri di accettazione prima versione

- L'app funziona aprendo `app/index.html`.
- Si puo' registrare una giornata completa.
- Tutti i campi obbligatori sono validati.
- Una registrazione esistente si puo' modificare.
- Una registrazione si puo' eliminare.
- Il calendario mostra i giorni registrati.
- Il grafico mostra i dati su assi X/Y.
- CSV e JSON sono scaricabili.
- JSON e' reimportabile.
- Il codice non dipende da servizi esterni.

## Decisioni rimandate

- Hosting finale.
- Sincronizzazione tra dispositivi.
- Libreria grafica.
- Campo note libero.
- Dati meteo o pollini.
- Eventuale cifratura locale.
