# Configurazione HTTPS per MAMP

## Metodo 1: Abilita SSL in MAMP PRO
Se hai MAMP PRO, è semplicissimo:
1. Apri MAMP PRO
2. Seleziona il tuo host (localhost)
3. Vai su SSL → Abilita SSL
4. Riavvia i server

## Metodo 2: Per MAMP Standard (manuale)

### Opzione A: Accedi tramite localhost
Usa semplicemente: `http://localhost:8888/quiz/` 
Il browser potrebbe mostrare meno avvisi con localhost rispetto a 127.0.0.1

### Opzione B: Configura certificato SSL manualmente

1. Modifica il file di configurazione Apache:
   `/Applications/MAMP/conf/apache/httpd.conf`
   
   Assicurati che questa riga NON sia commentata:
   ```
   Include /Applications/MAMP/conf/apache/extra/httpd-ssl.conf
   ```

2. Nel file `/Applications/MAMP/conf/apache/extra/httpd-ssl.conf` verifica che ci sia:
   ```
   Listen 443
   SSLEngine on
   SSLCertificateFile "/Applications/MAMP/conf/apache/server.crt"
   SSLCertificateKeyFile "/Applications/MAMP/conf/apache/server.key"
   ```

3. Riavvia i server MAMP

4. Accedi tramite: `https://localhost:8888/quiz/`

## Metodo 3: Per sviluppo locale - Ignora l'avviso

Durante lo sviluppo locale, è normale vedere "connessione non sicura" con HTTP.
- Puoi procedere comunque cliccando su "Avanzate" → "Procedi comunque"
- Questo NON è un problema per lo sviluppo locale
- Solo quando pubblichi il sito online dovrai usare HTTPS reale

## Note
- Il certificato self-signed mostrerà comunque un avviso nel browser, ma la connessione sarà criptata
- Per un sito in produzione (online), serve un certificato SSL valido (Let's Encrypt, ecc.)
