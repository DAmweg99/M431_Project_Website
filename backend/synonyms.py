"""
Synonym-/Oberbegriff-Gruppen für die Rezept-Suche.

Sucht jemand nach einem Oberbegriff (z.B. "Kartoffeln"), sollen auch
Rezepte gefunden werden, die ein verwandtes Produkt enthalten
(z.B. "Pommes Frites", weil Pommes aus Kartoffeln bestehen).

Jede Gruppe ist eine Menge zusammengehöriger Begriffe. Passt der
Suchbegriff zu einem Wort einer Gruppe, wird mit allen Wörtern der
Gruppe gesucht.
"""

SYNONYM_GROUPS = [
    # Kartoffeln und Kartoffelprodukte
    {
        "kartoffel", "kartoffeln", "härdöpfel", "pommes", "pommes frites",
        "frites", "fries", "rösti", "roesti", "gnocchi", "kartoffelstock",
        "kartoffelpüree", "kartoffelpuree", "püree", "bratkartoffeln",
        "kartoffelsalat", "wedges", "chips", "gschwellti",
    },
    # Rind / Hackfleisch
    {
        "rind", "rindfleisch", "rinderhack", "hackfleisch", "hack",
        "burger", "smashburger", "patty", "patties", "steak", "voressen",
        "tatar", "tartar",
    },
    # Geflügel
    {
        "geflügel", "gefluegel", "poulet", "pouletbrust", "huhn", "hähnchen",
        "haehnchen", "hühnchen", "chicken", "pute", "truthahn",
    },
    # Fisch / Meeresfrüchte
    {
        "fisch", "lachs", "lachsfilet", "thunfisch", "forelle", "dorade",
        "egli", "felchen", "garnelen", "crevetten", "shrimps", "scampi",
    },
    # Käse
    {
        "käse", "kaese", "cheddar", "parmesan", "mozzarella", "gruyère",
        "gruyere", "greyerzer", "raclette", "feta", "gorgonzola",
    },
    # Tomaten / Tomatenprodukte
    {
        "tomate", "tomaten", "ketchup", "passata", "sugo", "tomatenmark",
        "pelati", "cherrytomaten",
    },
    # Teigwaren / Pasta
    {
        "teigwaren", "pasta", "spaghetti", "nudeln", "penne", "tagliatelle",
        "spätzli", "spaetzli", "spätzle", "tortellini", "ravioli", "lasagne",
    },
    # Zwiebelgewächse
    {
        "zwiebel", "zwiebeln", "schalotte", "schalotten", "lauch",
        "frühlingszwiebel", "frühlingszwiebeln",
    },
    # Reis
    {
        "reis", "risotto", "basmati", "milchreis", "paella",
    },
    # Eier
    {
        "ei", "eier", "omelette", "rührei", "spiegelei", "pochiertes ei",
    },
]


def expand_search_terms(query: str) -> set:
    """
    Gibt den Suchbegriff plus alle passenden Synonyme zurück.
    Kurze Begriffe (< 3 Zeichen) werden nicht erweitert, um Fehltreffer
    zu vermeiden.
    """
    ql = query.strip().lower()
    terms = {ql}

    if len(ql) < 3:
        return terms

    for group in SYNONYM_GROUPS:
        for word in group:
            # Treffer bei Gleichheit oder Singular/Plural (z.B. kartoffel ↔ kartoffeln)
            if ql == word or word.startswith(ql) or ql.startswith(word):
                terms |= group
                break

    return terms
