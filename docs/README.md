# Allergy Log - Documentazione

Questo spazio raccoglie requisiti, ragionamenti di prodotto e decisioni tecniche per una piccola applicazione personale dedicata al diario allergologico.

L'obiettivo non e' replicare Allergyplan in modo fedele, ma costruire uno strumento piu' pratico per uso personale:

- registrare sintomi allergici ogni giorno;
- visualizzare l'andamento su calendario e grafici;
- esportare i dati in formato leggibile, soprattutto CSV;
- poter correggere, cancellare e integrare registrazioni passate;
- funzionare bene da smartphone;
- restare semplice da mantenere e possibilmente senza costi.

## Documenti

- [Requisiti](requirements/README.md)
- [Modello dati ed export](requirements/data-model.md)
- [Ragionamento prodotto](product/README.md)
- [Review prototipo](product/prototype-review.md)
- [Architettura e hosting](architecture/README.md)
- [Piano implementazione](architecture/implementation-plan.md)

## Prototipo corrente

Il primo prototipo statico vive fuori da questa cartella:

- [`../prototype/`](../prototype/)

## App corrente

La prima versione statica dell'app vive in:

- [`../app/`](../app/)

## Principio guida

Il diario deve essere abbastanza rapido da usare ogni giorno, ma abbastanza strutturato da produrre un export serio da portare a un medico o allergologo.
