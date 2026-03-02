#!/usr/bin/env python3
import random
import sys

CITIES = [
    "Hamburg", "Berlin", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf",
    "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hanover", "Nuremberg",
    "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Karlsruhe",
    "Mannheim", "Augsburg", "Wiesbaden", "Gelsenkirchen", "Mönchengladbach", "Braunschweig",
    "Chemnitz", "Kiel", "Aachen", "Halle", "Magdeburg", "Freiburg", "Lübeck", "Oberhausen",
    "Erfurt", "Mainz", "Rostock", "Kassel", "Hagen", "Hamm", "Saarbrücken", "Mülheim",
    "Potsdam", "Ludwigshafen", "Oldenburg", "Leverkusen", "Osnabrück", "Solingen", "Heidelberg",
    "Vienna", "Zurich", "Paris", "London", "Amsterdam", "Brussels", "Madrid", "Rome", "Milan",
    "Prague", "Warsaw", "Budapest", "Copenhagen", "Stockholm", "Oslo", "Helsinki", "Dublin",
    "Lisbon", "Barcelona", "Munich", "Milan", "Athens", "Bucharest", "Berlin", "Vienna",
    "Hamburg", "Budapest", "Warsaw", "Prague", "Copenhagen", "Stockholm", "Helsinki", "Dublin",
    "Bratislava", "Ljubljana", "Zagreb", "Belgrade", "Sarajevo", "Skopje", "Tirana", "Podgorica",
    "Reykjavik", "Tallinn", "Riga", "Vilnius", "Luxembourg", "Monaco", "Andorra", "San Marino",
    "Vaduz", "Bern", "Geneva", "Basel", "Lausanne", "Lyon", "Marseille", "Nice", "Turin",
    "Naples", "Palermo", "Genoa", "Bologna", "Florence", "Valencia", "Seville", "Bilbao",
    "Porto", "Lisbon", "Braga", "Coimbra", "Venice", "Verona", "Padua", "Trieste", "Bari",
    "Catania", "Turin", "Genoa", "Bologna", "Krakow", "Gdańsk", "Wrocław", "Poznań", "Lublin",
    "Białystok", "Bydgoszcz", "Toruń", "Zielona Góra", "Opole", "Zabrze", "Bielsko-Biała",
    "Bytom", "Ruda Śląska", "Rybnik", "Tychy", "Gliwice", "Dąbrowa Górnicza", "Jaworzno",
    "Jastrzębie-Zdrój", "Nowy Sącz", "Kalisz", "Piła", "Grudziądz", "Elbląg", "Tarnów",
    "Mokotów", "Praga-Południe", "Wola", "Żoliborz", "Ursus", "Bemowo", "Białołęka", "Targówek"
]

def generate_data(num_rows, filename):
    with open(filename, 'w', buffering=128 * 1024 * 1024) as f:
        for _ in range(num_rows):
            city = random.choice(CITIES)
            temp = round(random.uniform(-50.0, 50.0), 1)
            f.write(f"{city};{temp}\n")

def main():
    num_rows = int(sys.argv[1]) if len(sys.argv) > 1 else 1_000_000_000
    filename = sys.argv[2] if len(sys.argv) > 2 else "measurements.txt"
    print(f"Generating {num_rows:,} rows to {filename}...")
    generate_data(num_rows, filename)
    print("Done!")

if __name__ == '__main__':
    main()
