# Requisiti

## Obiettivo

Creare una piccola applicazione per registrare, consultare ed esportare un diario dei sintomi allergici.

Il caso d'uso principale e' mobile: l'utente deve poter compilare la registrazione quotidiana in meno di un minuto.

## Registrazione giornaliera

Ogni registrazione e' associata a una data.

Tutti i campi della registrazione principale sono obbligatori.

### Sintomi allergici principali

Per ogni sintomo si registra un valore da 1 a 4:

- 1: bene, nessun sintomo o sintomo trascurabile;
- 2: lieve;
- 3: moderato;
- 4: intenso.

I sintomi principali sono:

- prurito naso;
- starnuti;
- naso che cola;
- naso chiuso;
- prurito occhi;
- lacrimazione.

L'interfaccia deve usare faccine o indicatori visuali equivalenti per rendere immediata la scelta.

Nella versione corrente si usano emoji native, senza pacchetti esterni.

### Azione rapida

La prima schermata include un pulsante `Nessun sintomo`.

Quando premuto, imposta tutti i sintomi principali a `1`.

### Tempo all'aperto

Il tempo all'aperto si sceglie da una lista fissa con intervalli di 30 minuti:

- `00:00`
- `00:30`
- `01:00`
- ...
- `11:30`
- `12:00`

### Farmaci

Campo obbligatorio:

- hai preso farmaci per l'allergia? `si` / `no`

Se la risposta e' `si`, deve comparire la selezione farmaci e deve essere possibile selezionare uno o piu' farmaci da una lista gestibile.

Lista iniziale:

- antistaminico;
- foster;
- oralair.

L'utente deve poter aggiungere, rinominare ed eliminare farmaci dalla lista.

Se l'utente cambia la risposta a `no`, la selezione farmaci della giornata viene svuotata e nascosta.

## Seconda schermata

### Altri sintomi o impatti

Domande con risposta `si` / `no`:

- sonno disturbato;
- problemi a scuola/lavoro;
- sintomi fastidiosi;
- limitazione attivita' giornaliera.

### Intensita' percepita

Slider da `0` a `100`.

Questo valore rappresenta la percezione soggettiva complessiva della giornata.

## Comportamento dopo salvataggio

Dopo il salvataggio di una registrazione:

- i dati vengono salvati;
- il form viene pulito;
- la data torna a oggi;
- l'interfaccia torna alla schermata `1. Sintomi`;
- il form torna in modalita' `Nuova giornata`.

## Visualizzazioni

L'applicazione deve includere:

- calendario mensile con indicazione dei giorni registrati;
- dettaglio della registrazione selezionata;
- grafico dell'andamento dei sintomi;
- vista utile a capire rapidamente giorni buoni, medi e critici.

Nel calendario:

- clic su un giorno registrato: mostra il dettaglio della registrazione;
- clic su un giorno non registrato: apre la schermata di registrazione, imposta quella data e mostra il form vuoto allo step `Sintomi`.

## Esportazione

L'applicazione deve permettere di scaricare i dati registrati.

Formato minimo:

- CSV.

Formato opzionale utile:

- JSON, per backup e ripristino.

## Modifica e cancellazione

A differenza di Allergyplan, l'utente deve poter:

- inserire dati per qualunque data;
- modificare registrazioni gia' inserite;
- eliminare registrazioni;
- esportare l'intero diario.

## Vincoli non funzionali

- Deve funzionare bene da smartphone.
- Deve essere utilizzabile anche come pagina web statica.
- Deve evitare dipendenze inutili.
- Deve rendere chiaro che i dati restano locali se non viene introdotto un backend.
- Deve avere una struttura dati esportabile e leggibile.

## Fuori scope iniziale

Questi aspetti non sono richiesti nella prima versione:

- account utente;
- sincronizzazione multi-dispositivo;
- notifiche push;
- integrazione con API meteo o pollini;
- invio automatico al medico;
- classificazioni mediche o diagnosi.
