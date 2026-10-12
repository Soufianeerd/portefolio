# Showreel sur la landing

Le showreel de `index.html` référence deux médias ajoutés **à la racine du dépôt** :

- `/showreel-soufiane.mp4` — vidéo optimisée H.264/AAC, 3,97 Mo.
- `/showreel-poster.webp` — miniature WebP, 33 Ko.

Les fichiers ont été ajoutés sur `main`, avant la fusion de la PR. La branche de la PR ne les contient donc pas forcément avant la fusion.

Une fois fusionnée, vérifier les deux médias publiés, l'ouverture du lecteur au clic, le son, la fermeture (Échap/bouton/arrière-plan), le chargement différé et l'affichage mobile. Le lecteur ne crée l'élément `<video>` qu'au clic.
