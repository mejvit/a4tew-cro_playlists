# ČRo Playlists

## Semestrální projekt: Playlisty Českého rozhlasu

Tato aplikace byla vytvořena v rámci semestrálního projektu z předmětu A4TEW. Podle zadání jsem zvolil možnost A, tj. "**Klientská webová aplikace s REST API**".

### Funkcionalita

Aplikace pracuje s API pro získání playlistů, které poskytuje [Český rozhlas](https://data.irozhlas.cz/opendata/). Pomocí těchto API lze získat playlist dané stanice pro konkrétní datum a stanici. Aplikace samotná je rozdělena do tří částí: Plalisty, Nejhranější písničky a Nejhranější interpreti. V části **Playlisty** je možné si zobrazit playlist pro konkrétní stanici a den. Druhá část, **Nejhranější písničky** umí vypsat padesát nejhranějších skladeb za zvolené časové období na konkrétní stanici. Sekce **Nejhranější interpreti** pak zobrazí za zvolený časový úsek nejhranějšího interpreta pro danou stanici.

### Technické řešení

Celá aplikace je tvořena s pomocí vývojového frameworku [Vue.js](https://vuejs.org/). Volání API se děje prostřednictvím modulu [Axios](https://github.com/axios/axios). Aby nedocházelo ke zbytečně častému volání API, ukládá aplikace data u klienta. Pro samotná data (playlisty) je využito zabudované uložiště v prohlížeči **IndexedDB**, záznamy o tom, který den a která stanice je uložena se vede v LocalStorage. S uložištěm IndexedDB se komunikuje pomocí knihovny [Dexie](https://dexie.org/). Ta poskytuje intuitivní API pro práci s databází oproti nativním funkcím. Záznamy v IndexedDB jsou rozděleny do dvou objektových uložišť. Prvním je _playlist_history_, které obsahuje záznam o čase, stanici a id písničky; druhým je pak _song_list_, který slouží jako databáze písniček.

Žebříčky nehranějších skladeb a interpretů se pak sestavují pomocí dotazů na uložiště prostřednictvím knihovny Dexie.

Pro vzhled aplikace jsem použil CSS framework [Bootstrap](https://getbootstrap.com/) ve verzi 4, pro navigaci pak čisté CSS.
