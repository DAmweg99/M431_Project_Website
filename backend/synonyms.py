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
        # Englisch
        "potato", "potatoes", "mashed potatoes", "hash browns",
    },
    # Rind / Hackfleisch
    {
        "rind", "rindfleisch", "rinderhack", "hackfleisch", "hack",
        "burger", "smashburger", "patty", "patties", "steak", "voressen",
        "tatar", "tartar",
        # Englisch
        "beef", "ground beef", "minced meat", "minced beef",
    },
    # Geflügel
    {
        "geflügel", "gefluegel", "poulet", "pouletbrust", "huhn", "hähnchen",
        "haehnchen", "hühnchen", "chicken", "pute", "truthahn",
        # Englisch
        "poultry", "chicken breast", "turkey",
    },
    # Fisch / Meeresfrüchte
    {
        "fisch", "lachs", "lachsfilet", "thunfisch", "forelle", "dorade",
        "egli", "felchen", "garnelen", "crevetten", "shrimps", "scampi",
        # Englisch
        "fish", "salmon", "tuna", "trout", "shrimp", "prawns", "seafood",
    },
    # Käse
    {
        "käse", "kaese", "cheddar", "parmesan", "mozzarella", "gruyère",
        "gruyere", "greyerzer", "raclette", "feta", "gorgonzola",
        # Englisch
        "cheese",
    },
    # Tomaten / Tomatenprodukte
    {
        "tomate", "tomaten", "ketchup", "passata", "sugo", "tomatenmark",
        "pelati", "cherrytomaten",
        # Englisch
        "tomato", "tomatoes", "cherry tomatoes", "tomato paste",
    },
    # Teigwaren / Pasta
    {
        "teigwaren", "pasta", "spaghetti", "nudeln", "penne", "tagliatelle",
        "spätzli", "spaetzli", "spätzle", "tortellini", "ravioli", "lasagne",
        # Englisch
        "noodles", "lasagna",
    },
    # Zwiebelgewächse
    {
        "zwiebel", "zwiebeln", "schalotte", "schalotten", "lauch",
        "frühlingszwiebel", "frühlingszwiebeln",
        # Englisch
        "onion", "onions", "shallot", "shallots", "leek", "spring onion",
        "scallion",
    },
    # Reis
    {
        "reis", "risotto", "basmati", "milchreis", "paella",
        # Englisch
        "rice",
    },
    # Eier
    {
        "ei", "eier", "omelette", "rührei", "spiegelei", "pochiertes ei",
        # Englisch
        "egg", "eggs", "scrambled eggs", "fried egg", "poached egg",
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
