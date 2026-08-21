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
| `usctri_v4.js` | Code applicatif utilisé par la page |
| `usctri_v3.js` | Version précédente (jQuery 1.11.1), conservée pour mémoire, non chargée |
| `usctri.js` | Ancienne version (v1), conservée pour mémoire, non chargée |
| `usctri.css` | Feuille de style |
| `1.png`, `2.png`, `3.png` | Médailles or / argent / bronze |
| `ferme.gif`, `ouvert.gif`, `back25.png` | Icônes d'interface |

## Migration vers jQuery 4

La page chargeait `https://code.jquery.com/jquery-latest.js`, **figé à la version
1.11.1 depuis 2014** : c'est ce que signalaient les alertes Dependabot. Elle charge
désormais `jquery-4.0.0.min.js`, avec `usctri_v4.js` à la place de `usctri_v3.js`.

`usctri_v4.js` est la copie de `usctri_v3.js` avec deux corrections, sans lesquelles
les tableaux de résultats s'affichent de travers (sans aucune erreur en console) :

1. **jQuery 4 ne crée plus le `<tbody>` manquant** lorsqu'on ajoute une ligne à un
   tableau. Les `<tr>` devenaient alors enfants directs de `<table>` et les
   parcours en `.children()` inséraient chaque résultat *dans* les lignes
   d'en-tête. Le tableau est donc maintenant créé avec son `<tbody>`.
2. **jQuery 4 ne referme plus les balises `<tag />`** (comportement retiré en 3.5
   avec le correctif XSS CVE-2020-11022 / 11023). Or la colonne `UrlImage` de la
   feuille contient le plus souvent un `<iframe … />` auto-fermant : sans
   réécriture, l'iframe n'est jamais refermée et avale la suite du tableau. Le
   code refait donc lui-même cette réécriture sur ce seul champ.

Les deux corrections sont sans effet sous jQuery 1.11.1 : en cas de besoin, on peut
revenir à `usctri_v3.js` et à l'ancienne version de jQuery en modifiant les deux
balises `<script>` de `usctri_res.html`. Le rendu de la page a été comparé ligne à
ligne entre les deux versions (même données, même instant) : il est identique.

Le déploiement se fait par simple `git push` sur `master` (GitHub Pages).

## Auteurs et licence

Voir [AUTHORS](AUTHORS). Code et contenu sous licence
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/),
hors exclusions précisées dans [LICENSE](LICENSE).
