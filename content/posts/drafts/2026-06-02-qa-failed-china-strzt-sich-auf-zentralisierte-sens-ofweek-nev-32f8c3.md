---
title: "[QA FAILED] China stürzt sich auf zentralisierte Sensorarchitektur"
date: 2026-06-02T13:54:39.731Z
description: "Die chinesische Autoindustrie verlagert die Algorithmen für autonomes Fahren von Tier-1 zu OEMs. Rohdaten fusionieren zentral im SoC – BYD treibt den Wandel voran."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "NXP", "Texas Instruments"]
tags: ["Reichweite", "Hybrid"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] China stürzt sich auf zentralisierte Sensorarchitektur

## Was ist die neue Architektur?

Bislang arbeitete jeder Radarsensor im Auto wie ein eigenständiger „Minicomputer" – er erfasste Ziele, filterte Rauschen und gab nur aggregierte Daten wie „Hindernis in 50 Metern" weiter. Jetzt setzt sich in China ein radikal anderer Ansatz durch: Statt der aufbereiteten Ergebnisliste landen die rohen, unverarbeiteten Signale aller Sensoren direkt im zentralen ADAS-SoC (System-on-Chip). Die sogenannte „dezentrale" Architektur (gemeint ist die Verlagerung der Algorithmen von den Sensoren auf den Zentralrechner) ermöglicht eine echte Sensorfusion auf Rohdatenebene.

Der Vorteil: Ein klassisches Beispiel – ein Millimeterwellen-Radar sieht durch Regen viel besser als ein Lidar. In der alten, dezentralen Bauweise meldet das eine Radar „kein Hindernis", das Lidar aber „Hindernis". Das System steht vor einem Widerspruch. Im neuen Modell rekonstruiert die zentrale Algorithmik aus beiden Rohdaten ein gemeinsames Umgebungsbild – aus 1+1 wird nicht 2, sondern 5.

## Warum gelingt der Umbruch erst jetzt?

Der Grund liegt in der jahrzehntelangen Dominanz der Tier-1-Zulieferer. Sie hielten das Know-how zur Radarsignalverarbeitung – von der FFT-Spektralanalyse bis zur Zielverfolgung – in ihren Black-Box-Firmwaren. Die OEMs bekamen nur fertige „Häppchen" und konnten nie mitkochen. Nun forcieren die chinesischen Hersteller den Bruch: Die Signalverarbeitung wird auf die SoC-Plattform im Fahrzeug zentralisiert. NXP und Texas Instruments treiben diese Entwicklung mit speziellen Radar-Bridge-Chips und RSP-IP (Radar-Signalverarbeitungs-IP) voran, die direkt in die ADAS-SoCs integriert werden.

Auch die Chiphersteller passen ihre Schnittstellen an. Der bisher für Kamera-Frames optimierte MIPI-Standard wird um eine effiziente Datenorganisation für Radar-Rohdaten (komplexe Amplituden-Werte in 2D-Arrays) ergänzt. Das Ziel ist klar: Die Algorithmenhoheit wandert von den Tier-1 zu den Automobilherstellern.

## Technische Details der Radartypen

**Millimeterwellen-Radar:** Die 4D-Radar-Module folgen zwei Pfaden. China setzt auf günstige „1 SoC + 2 MMIC"-Varianten mit 8T8R (acht Sende-, acht Empfangskanäle). Europa plant bereits 24T24R. Bis 2028 werden sich 8T8R- und 24T24R-Architekturen durchsetzen.

**Lidar:** Die zentralisierte Architektur reduziert die Kosten des Signalprozessors (FPGA) im Lidar. Künftig liefern die Lidars nur noch Rohdaten (Punktwolken mit Entfernung, Intensität, Doppler) mit Datenraten von bis zu 3,6 Gbit/s. Die Verarbeitung übernimmt der zentrale SoC. Allerdings unterscheidet sich die Datenstruktur fundamental von Kameradaten – ein Frame besteht aus 1200 Slots statt Pixeln, was die DSP-Effizienz beeinträchtigen kann.

**Ultraschall-Radar:** Hier vereinfacht sich die Algorithmik am stärksten. Statt aufwändiger Signalverarbeitung reicht ein einfaches Impuls-Laufzeitverfahren. Der zentrale SoC kann durch detaillierte Korrelationsfilter rund 20 % mehr Reichweite und zehnmal höhere Dichte herausholen.

## BYD als Vorreiter

Der chinesische Hersteller BYD (比亚迪) hat ein Hybridmodell vorgestellt: Ein zentraler Controller sammelt die Rohdaten von sechs Lidars, verarbeitet sie vor und gibt die Informationen an die Haupt-SoCs weiter. Das ergibt eine Steigerung von 20 % Latenz, 20 % Reichweite und zehnfacher Dichte – ein Kompromiss zwischen vollständiger Zentralisierung und lokaler Vorverarbeitung.

## Fazit

Die chinesische Automobilindustrie zerschlägt die Black-Box der Tier-1 und verlagert die Algorithmenkompetenz ins Fahrzeug. Nur mit rohen, ungefilterten Sensordaten kann die KI für das autonome Fahren der Stufen L2+ bis L3 ihre volle Leistung entfalten. Der Wettbewerb um die beste Architektur hat gerade erst begonnen.

---

Dieser Artikel beschreibt einen technologischen Trend in der chinesischen Automobilindustrie. Auch deutsche Hersteller und Tier-1 arbeiten an zentralisierten Sensorarchitekturen – allerdings mit unterschiedlichen Ansätzen. Eine direkte Markteinführung eines konkreten Modells ist nicht betroffen.
