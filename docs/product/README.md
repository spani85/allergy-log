# Ragionamento prodotto

## Problema

Allergyplan copre bene la registrazione quotidiana, ma impone limiti pratici:

- non consente di inserire liberamente dati storici;
- limita l'inserimento a ieri e oggi, con vincoli orari;
- non permette di correggere o cancellare registrazioni;
- non permette di scaricare un CSV completo.

Per un diario personale da portare a uno specialista, questi limiti sono importanti.

## Proposta

Costruire un diario allergologico personale, mobile-first, con tre aree principali:

- inserimento rapido;
- calendario e dettaglio;
- export.

## Flusso ideale

1. L'utente apre l'app dal telefono.
2. La schermata mostra subito la data di oggi e i campi principali.
3. Se sta bene, preme `Nessun sintomo` e completa solo tempo all'aperto, farmaci e seconda schermata.
4. Se ha sintomi, imposta i valori da 1 a 4.
5. Salva.
6. In un secondo momento puo' aprire calendario, correggere una data o esportare CSV.

## Mobile-first

La registrazione deve usare controlli grandi e rapidi:

- selettori a 4 stati per i sintomi;
- bottoni si/no per i booleani;
- select o segmented picker per il tempo all'aperto;
- slider per intensita' 0-100;
- calendario compatto.

## Tono dell'interfaccia

L'app deve essere sobria e pratica.

Non serve un'impostazione da landing page. La prima cosa visibile deve essere l'azione utile: registrare o consultare il diario.

## Decisioni aperte

- L'app deve partire da una singola pagina HTML/CSS/JS o da un piccolo progetto con build?
- I dati devono restare solo locali o serve presto una sincronizzazione?
- Serve un campo note libero?
- Serve import JSON oltre a export JSON?
- Vogliamo aggiungere meteo/pollini in futuro o restare su diario manuale?

## Criteri di successo per la prima versione

- Registrare una giornata completa da smartphone in meno di un minuto.
- Vedere su calendario quali giorni sono stati registrati.
- Capire a colpo d'occhio quali giorni sono stati peggiori.
- Scaricare un CSV leggibile.
- Modificare o cancellare una registrazione senza ostacoli.

## Esito prototipo

La review del primo prototipo e' documentata in [prototype-review.md](prototype-review.md).
