
## dagViz

Le but de ce répertoire github est d'offrir la visualisation de graphe dirigé pour les étudiants du cours IFT3295.  Vous pouvez utiliser l'app web ici ==> https://mrnoutahi.com/dagViz/

Le format accepté est le format `edgelist` avec ou sans les poids des arrêtes. Ce format liste toute les arrêtes du graphe.

#### Exemple1

Dans cet exemple, le poids des arrêtes représente le score de l'alignement entre chaque paire de séquences considérée. 
Notez que les poids seront utilisés dans ce cas pour définir l'épaisseur des arrêtes correspondantes.

    seq1	seq2	35
    seq1	seq3	23
    seq2	seq3	14
    seq2	seq4	19
    seq1	seq4	26

#### Exemple2

    seq1	seq2
    seq1	seq3
    seq2	seq3
    seq2	seq4
    seq1	seq4

Dans cet exemple, il n'y a pas de poids pour les arrêtes, et donc par défaut tous les poids sont à 1.
