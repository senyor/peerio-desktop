How to generate the hash of a cert to update cert pinning:

```openssl x509 -in test.cert -noout -sha256 -fingerprint | sed -e 's/SHA256 Fingerprint=//g' | xxd -r -p | base64
sha256/ulpgOSCeCDansrj8y5VryMSZGHe1yiOAWZ35eFGZZnw=```
~
~
