# Review prototipo

Data review: 2026-07-31.

Prototipo: [`../../prototype/`](../../prototype/)

## Stato

Il primo prototipo e' sufficiente per validare il flusso principale.

Non e' ancora codice di produzione, ma ha chiarito:

- quali campi servono;
- come organizzare la registrazione in due schermate;
- quali azioni rapide riducono attrito;
- come distinguere calendario, grafici ed export;
- quali parti devono diventare piu' robuste prima dell'uso reale.

## Funzioni validate

### Registrazione

La registrazione in due passaggi funziona bene come modello:

1. sintomi principali, tempo all'aperto e farmaci;
2. impatti sulla giornata e intensita' percepita.

Questo mantiene la prima schermata focalizzata sui dati piu' frequenti e sposta gli effetti generali nel secondo passaggio.

### Azioni rapide

Sono utili due azioni rapide:

- `Nessun sintomo` nella schermata sintomi: imposta tutti i sintomi principali a `1`;
- `Nessun sintomo` nella schermata impatto: imposta tutte le domande si/no a `No`.

La seconda azione evita di dover premere quattro volte `No` nelle giornate tranquille.

### Calendario

Il calendario mensile e' una vista necessaria.

Deve mostrare:

- quali giorni sono compilati;
- un'indicazione visiva della gravita';
- accesso rapido al dettaglio del giorno;
- modifica ed eliminazione.

Comportamento aggiunto dopo test su app reale:

- se il giorno cliccato e' registrato, il calendario mostra il dettaglio;
- se il giorno cliccato non e' registrato, l'app apre subito la schermata di registrazione con quella data preimpostata.

### Grafico

La lista di barre orizzontali non era sufficiente.

Il modello corretto e':

- asse X: giorni;
- asse Y: valore da `0` a `100`;
- barre verticali in corrispondenza dei giorni.

Il grafico deve poter mostrare almeno:

- indice sintomi calcolato dai 6 sintomi principali;
- intensita' percepita.

### Export e backup

Export CSV e JSON sono requisiti centrali, non accessori.

Il CSV serve per consultazione medica o analisi in foglio di calcolo.

Il JSON serve per backup e ripristino senza perdita dei dati.

## Decisioni prese

- `docs/` resta dedicata alla documentazione.
- Il codice applicativo deve vivere fuori da `docs/`.
- Per ora non serve un framework.
- La prima applicazione vera puo' restare vanilla HTML/CSS/JS.
- La PWA e' desiderabile, ma puo' essere aggiunta in modo leggero dopo aver stabilizzato l'app.
- Il dato resta locale al browser nella prima versione.

## Limiti del prototipo

- Nessun test automatico.
- Nessuna separazione tra logica dati, rendering e stato UI.
- Grafico custom sufficiente, ma ancora basilare.
- Nessuna gestione evoluta di migrazioni dati.
- Nessun messaggio strutturato per import/export falliti.
- Nessuna modalita' installabile su smartphone.
- Accessibilita' da verificare meglio.

## Requisiti emersi dal test

- I pulsanti si/no devono essere gestiti in modo uniforme, sia se statici sia se generati via JavaScript.
- Le azioni rapide devono esistere su entrambe le schermate di registrazione.
- Il grafico deve essere percepito come grafico cartesiano, non come semplice lista.
- La navigazione principale deve includere `Grafici` come sezione autonoma.
- Dopo il salvataggio, il form deve tornare pulito alla schermata sintomi.
- Il selettore farmaci deve essere visibile solo quando `Farmaci allergia` e' `Si`.
- Le faccine testuali sono sufficienti per il prototipo, ma nell'app reale e' preferibile usare emoji native.

## Criterio per passare all'app vera

Il prototipo puo' essere promosso a base dell'app vera solo dopo aver separato almeno:

- storage;
- validazione;
- rendering calendario;
- rendering grafici;
- export/import.

Non serve introdurre un framework solo per ottenere questa separazione.
