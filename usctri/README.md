# Résultats aux compétitions — US Créteil Triathlon

Page web statique affichant les résultats du club aux compétitions, alimentée
directement par une feuille Google Sheets interrogée en JSONP (aucun serveur).

**En ligne :** https://tjbtjbtjb.github.io/usctri/usctri_res.html

## Utilisation locale

```bash
# depuis la racine du dépôt
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/usctri/usctri_res.html
```

Une connexion internet est nécessaire : les données sont chargées à la volée
depuis Google Sheets.

## Contenu

| Fichier | Rôle |
| --- | --- |
| `usctri_res.html` | La page (seul point d'entrée) |
| `usctri_v3.js` | Code applicatif utilisé par la page |
| `usctri.js` | Ancienne version (v1), conservée pour mémoire, non chargée |
| `usctri.css` | Feuille de style |
| `1.png`, `2.png`, `3.png` | Médailles or / argent / bronze |
| `ferme.gif`, `ouvert.gif`, `back25.png` | Icônes d'interface |

Le déploiement se fait par simple `git push` sur `master` (GitHub Pages).

## Auteurs et licence

Voir [AUTHORS](AUTHORS). Code et contenu sous licence
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/),
hors exclusions précisées dans [LICENSE](LICENSE).
