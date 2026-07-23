# Cinema Hollywood

Sito statico per Cinema Hollywood, pubblicato con GitHub Pages.

## Modificare i film

Per aggiornare programmazione, locandine e trailer modifica solo `movies.json`.

Ogni film usa questi campi:

```json
{
  "title": "Titolo film",
  "kicker": "Etichetta nel carosello",
  "description": "Descrizione breve",
  "genre": "Genere",
  "showtimes": ["18:00", "21:30"],
  "room": "Sala unica",
  "poster": "assets/nome-locandina.jpg",
  "alt": "Descrizione locandina",
  "trailerEmbed": "https://www.youtube.com/embed/ID_VIDEO"
}
```

Per aggiungere una locandina:

1. Metti il file immagine nella cartella `assets`.
2. Aggiorna il campo `poster` in `movies.json`.
3. Usa locandine verticali, meglio se almeno 1300 x 2000 px.

Per il trailer YouTube:

1. Apri il video su YouTube.
2. Copia l'ID dopo `watch?v=`.
3. Inseriscilo cosi: `https://www.youtube.com/embed/ID_VIDEO`.

Esempio:

Video: `https://www.youtube.com/watch?v=Ox8ZLF6cGM0`

Embed da mettere nel JSON:

```text
https://www.youtube.com/embed/Ox8ZLF6cGM0
```
