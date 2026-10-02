# Architettura e hosting

## Opzione consigliata per partire

Una single-page app statica, senza backend.

Possibile struttura futura:

```text
src/
  index.html
  app.css
  app.js
docs/
  README.md
  requirements/
  architecture/
  product/
```

`docs/` resta dedicata alla documentazione.

## Storage locale

La prima versione puo' salvare i dati in `localStorage`.

Vantaggi:

- nessun server;
- nessun account;
- funziona come file statico;
- costo zero;
- implementazione rapida.

Svantaggi:

- i dati vivono nel browser;
- rischio perdita dati se si cancellano dati sito/browser;
- nessuna sincronizzazione multi-device;
- backup manuale necessario.

## IndexedDB

`IndexedDB` e' piu' robusto di `localStorage`, ma introduce piu' complessita'.

Per la prima versione, `localStorage` e' sufficiente se il JSON export/import arriva presto.

## PWA

Una Progressive Web App puo' essere utile dopo la prima versione:

- icona sulla home dello smartphone;
- esperienza piu' simile a un'app;
- possibile uso offline tramite service worker.

Non e' necessaria per validare il diario.

Su Android/Chrome la pagina pubblicata puo' gia' essere aggiunta alla schermata principale tramite il menu del browser. In alcune versioni di Chrome l'azione puo' comparire come `Installa` o `Installa e crea scorciatoia`, non necessariamente come `Aggiungi a schermata Home`.

Una PWA completa con `manifest.webmanifest` e `service-worker.js` renderebbe l'installazione piu' affidabile e l'esperienza piu' simile a un'app standalone.

## Hosting

### File locale

La soluzione piu' semplice: aprire `index.html` direttamente dal dispositivo o da una cartella sincronizzata.

Limite: su smartphone puo' essere meno comodo distribuire/aprire il file.

### GitHub Pages

GitHub Pages e' comodo per siti statici, ma con GitHub Free funziona per repository pubblici. Per repository privati serve un piano GitHub che supporti Pages da repo privati.

Dato che il diario contiene dati personali, non bisogna salvare dati reali nel repository.

Anche se il sito fosse pubblico, i dati possono restare locali nel browser, ma il codice sarebbe visibile.

Per questa app il deploy usa GitHub Actions, non la pubblicazione diretta da branch/cartella.

Workflow:

```text
.github/workflows/pages.yml
```

Il workflow pubblica solo la cartella:

```text
app/
```

Questo permette di tenere `docs/` come documentazione interna al repository e `prototype/` come riferimento storico, senza pubblicarli nel sito.

Configurazione richiesta su GitHub:

```text
Repository -> Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

Quando viene fatto push su `main`, GitHub Actions crea l'artifact Pages usando `app/` e lo pubblica.

Il file `app/robots.txt` contiene:

```text
User-agent: *
Disallow: /
```

Questo chiede ai crawler di non indicizzare il sito, ma non e' una misura di sicurezza. Chi conosce l'URL puo' comunque aprire l'app.

### Altre opzioni gratuite

Possibili alternative da valutare:

- Netlify;
- Cloudflare Pages;
- Vercel;
- hosting statico personale.

La scelta dipende da privacy desiderata, facilita' d'uso da smartphone e disponibilita' di account.

## Raccomandazione iniziale

Partire con:

- app statica;
- dati locali;
- export CSV;
- export/import JSON;
- documentazione in `docs/`;
- codice applicativo fuori da `docs/`.

Solo dopo la prima versione conviene decidere se pubblicarla come PWA o tenerla come strumento locale.

## Piano operativo

Il piano per passare dal prototipo alla prima versione reale e' in [implementation-plan.md](implementation-plan.md).
