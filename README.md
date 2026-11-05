# Un aiuto

Un’esperienza essenziale in Next.js e TypeScript: sfondo bianco a tutto schermo, tre domande al centro e pensieri rassicuranti.

## Avvio

```sh
npm install
npm run dev
```

Aprire http://127.0.0.1:3000. Produzione: `npm run build`, poi `npm start`.

Nome, età e lavoro vengono chiesti uno alla volta. Invio (o il pulsante “premi invio”) conferma ogni risposta. L’età deve essere un intero da 1 a 120. Il campo di risposta riceve automaticamente il focus e mostra il cursore nativo lampeggiante.

Dopo la terza risposta, una transizione di dissolvenza e sfocatura introduce dodici pensieri, personalizzati con il nome, che cambiano ogni 11 secondi. Sono disponibili pausa, ripresa, avanzamento manuale e riavvio. Le preferenze di movimento ridotto disattivano le animazioni e fanno iniziare le frasi in pausa.

I dati restano nello stato React e si perdono al ricaricamento o al riavvio. Nessun account, database, analytics, font esterno o invio del modulo a un server. Età e lavoro sono raccolti ma non usati per profilare o modificare i pensieri.

Il progetto offre spunti di pausa e non assistenza psicologica.
