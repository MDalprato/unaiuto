# Un aiuto

Un’esperienza essenziale in Next.js e TypeScript: sfondo bianco a tutto schermo, due domande al centro e pensieri rassicuranti.

## Avvio

```sh
npm install
npm run dev
```

Aprire http://127.0.0.1:3000. Produzione: `npm run build` genera il sito statico nella cartella `out/`. Non serve un server Next.js.

Nome ed età vengono chiesti uno alla volta. Invio (o il pulsante “premi invio”) conferma ogni risposta. L’età deve essere un intero da 1 a 120. Il campo di risposta riceve automaticamente il focus e mostra il cursore nativo lampeggiante.

Dopo la seconda risposta, una transizione di dissolvenza e sfocatura introduce dodici pensieri, personalizzati con il nome, che cambiano ogni 11 secondi. Sono disponibili pausa, ripresa, avanzamento manuale e riavvio. Durante i pensieri, Invio passa alla frase successiva con la stessa transizione, anche in pausa. La scorciatoia è sospesa nella spiegazione “Cos’è?” e rispetta i controlli che hanno il focus. Le preferenze di movimento ridotto disattivano le animazioni e fanno iniziare le frasi in pausa.

Nome ed età vengono salvati nel cookie `unaiuto_profile` per 180 giorni, così alle visite successive si passa direttamente ai pensieri senza mostrare le domande. Il cookie è limitato al sito (`Path` limitato al percorso del sito, `SameSite=Lax`, `Secure` su HTTPS). Come tutti i cookie del sito, può accompagnare le richieste al suo server; non viene salvato in un database né condiviso con servizi esterni. Nessun account, analytics o font esterno. L’età non viene usata per profilare o modificare i pensieri.

“ricomincia” cancella il cookie e permette di reinserire i dati. Cookie mancanti, non validi o bloccati non impediscono di usare il sito: vengono riproposte le domande.

Il progetto offre spunti di pausa e non assistenza psicologica.


## GitHub Pages

Il workflow `.github/workflows/pages.yml` compila e pubblica il sito a ogni push su `main`, oppure manualmente da **Actions → Deploy to GitHub Pages → Run workflow**.

1. Carica queste modifiche sul repository `MDalprato/unaiuto`, nel branch `main`.
2. In **Settings → Pages → Build and deployment → Source**, scegli **GitHub Actions**.
3. Avvia il workflow o effettua un nuovo push su `main`.
4. Al termine del deploy, il sito sarà disponibile su https://mdalprato.github.io/unaiuto/ (salvo dominio personalizzato).

Il workflow legge il percorso da `actions/configure-pages` e lo passa a Next.js tramite `NEXT_PUBLIC_BASE_PATH`: funziona sia sotto `/unaiuto/` sia alla radice su un dominio personalizzato. Nessuna credenziale da aggiungere. L’abilitazione di Pages nelle impostazioni resta necessaria.

### Verifica locale dell’esportazione per Pages

```sh
NEXT_PUBLIC_BASE_PATH=/unaiuto npm run build
mkdir -p /tmp/unaiuto-pages/unaiuto
cp -R out/. /tmp/unaiuto-pages/unaiuto/
python3 -m http.server 3001 --bind 127.0.0.1 --directory /tmp/unaiuto-pages
```

Apri http://127.0.0.1:3001/unaiuto/. Il comando di anteprima richiede Python 3. Per lo sviluppo normale usa `npm run dev` senza impostare `NEXT_PUBLIC_BASE_PATH`.
