> **Disclaimer:** Questo software è fornito "così com'è", senza garanzie di alcun tipo. L'autore non si assume alcuna responsabilità per eventuali errori o perdite di dati. Si consiglia agli utenti di eseguire regolarmente il backup di tutti i dati critici.

> **Nota:** Questo progetto è stato sviluppato con l'assistenza di un'IA. Le funzionalità specifiche per Android sono state implementate dall'IA, poiché l'autore originale non è uno sviluppatore Android.

# App per Scout Pallavolo

[Read in English](README.md)

Un'applicazione web basata su React progettata per lo scouting di partite di pallavolo. Questa applicazione consente la registrazione degli atleti, lo scouting in tempo reale delle partite, la generazione di report statistici e l'esportazione di tali report in PDF.

## Funzionalità

*   **Gestione Atleti:** Registra gli atleti con numero di maglia, nome e cognome.
*   **Importazione Atleti da File:** Importa facilmente un elenco di atleti da un file di testo (.txt o .md). Ogni riga del file dovrebbe rappresentare un atleta, con il formato: `numeroMaglia nome cognome`. Solo `numeroMaglia` e `nome` sono obbligatori. Ad esempio:
    ```
    10 Mario Rossi
    5 Luigi
    ```
    Questa funzionalità è accessibile tramite un pulsante "Importa Atleti" nell'intestazione. L'inserimento manuale degli atleti rimane disponibile per integrare giocatori mancanti.
*   **Scouting Partita:** Un'interfaccia intuitiva per registrare le valutazioni dei fondamentali (Servizio, Ricezione, Difesa, Attacco) per ogni giocatore.
*   **Salvataggio Automatico:** Tutte le modifiche ai contatori nell'interfaccia di scouting vengono salvate automaticamente.
*   **Griglia di Scouting Dinamica:** Visualizza i fondamentali come righe e i tipi di valutazione (`#`, `+`, `-`, `=`) come colonne, con pulsanti di incremento/decremento rapido.
*   **Report Statistico:** Genera una tabella completa delle statistiche individuali dei giocatori e dei totali di squadra aggregati.
*   **Esportazione PDF:** I report possono essere esportati come file PDF. Questa funzione è supportata sia su build web che Android. Su Android, il file viene salvato nella directory `Documenti`.
*   **Temi:** Supporta sia il tema chiaro che quello scuro.

## Installazione

### Prerequisiti

*   [Node.js](https://nodejs.org/) e npm (o yarn) installati.
*   [Android Studio](https://developer.android.com/studio) per le build Android.

### Passaggi

1.  Clona la repository:
    ```bash
    git clone https://github.com/MassimilianoRozza/Easy-Volley-Scout.git
    ```
2.  Naviga nella directory del progetto:
    ```bash
    cd scout_app_web
    ```
3.  Installa le dipendenze:
    ```bash
    npm install
    ```

## Esecuzione dell'applicazione (Sviluppo)

Per eseguire l'applicazione in modalità di sviluppo:

```bash
npm start
```

Questo aprirà l'applicazione nel tuo browser all'indirizzo `http://localhost:3000`.

## Compilazione per la Produzione

### Web

Per compilare l'applicazione per la produzione web:

```bash
npm run build
```

Questo creerà una directory `build` con i file statici pronti per la produzione.

### Android

Per compilare l'applicazione per Android:

1.  **Compila l'applicazione web:**
    ```bash
    npm run build
    ```
2.  **Sincronizza le modifiche con il progetto Android:**
    ```bash
    npx cap sync android
    ```
3.  **Apri il progetto in Android Studio:**
    ```bash
    npx cap open android
    ```
4.  In Android Studio, puoi compilare l'APK usando il menu: `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.

## Manuale d'uso

L'applicazione segue una navigazione chiara e basata sulle fasi:

1.  **Setup:** Inserisci il nome della partita.
2.  **Atleti:** Registra gli atleti che parteciperanno alla partita.
3.  **Scouting:** Registra i dati di scouting per ogni giocatore utilizzando la griglia.
4.  **Report:** Visualizza il report statistico ed esportalo in PDF se necessario.

## Limitazioni

*   L'applicazione è progettata specificamente per lo scouting della pallavolo.
*   La build per Android richiede i permessi per scrivere sulla memoria del dispositivo. Il PDF viene salvato nella cartella `Documenti`.