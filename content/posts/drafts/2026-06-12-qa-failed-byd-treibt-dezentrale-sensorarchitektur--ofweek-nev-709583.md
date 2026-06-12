---
title: "[QA FAILED] BYD treibt dezentrale Sensorarchitektur: Rohdaten statt Blackbox"
date: 2026-06-12T12:51:15.929Z
description: "Chinas Autoindustrie setzt auf eine neue Architektur für autonomes Fahren: Statt vorgefilterter Daten von Radar und Lidar werden Rohsignale zentral verarbeitet. Das verspricht bessere Fusion."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite", "Hybrid"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] BYD treibt dezentrale Sensorarchitektur: Rohdaten statt Blackbox

Chinesische Automobilhersteller bereiten einen grundlegenden Wandel in der Sensorarchitektur für Fahrassistenzsysteme vor. Statt jedes Radar- oder Lidarmodul seine eigenen „Vorentscheidungen“ treffen zu lassen, sollen künftig rohe, unverarbeitete Signale an eine zentrale Recheneinheit gesendet werden. Diese sogenannte **dezentrale Sensorarchitektur** (auch: verteilte Rohdatenfusion) verspricht eine präzisere Umfelderkennung – zum Preis deutlich höherer Anforderungen an Datenübertragung und Rechenleistung.

## Was ist das Besondere an der dezentralen Architektur?

Bisher arbeiteten Sensoren wie Millimeterwellenradar, Lidar oder Ultraschall oft als „Blackboxen“. Sie erfassen Ziele, filtern Rauschen, berechnen Abstand und Geschwindigkeit – und melden eine reduzierte Liste wie „Objekt in 50 Metern Entfernung“. Diese Informationen gehen verloren, denn ein nasser Untergrund oder diffuse Reflexionen sind aus der fertigen Liste nicht mehr erkennbar.

Die neue Architektur kehrt dieses Prinzip um. **Stattdessen werden die Rohdaten** – zum Beispiel das FFT-Spektrum des Radars oder die Punktewolke des Lidars – über Hochgeschwindigkeitsverbindungen (wie SerDes, GMSL) direkt an ein zentrales ADAS-SoC gesendet. Erst dort fusioniert ein leistungsfähiger Algorithmus die unverarbeiteten Signale aller Sensoren. Das ermöglicht eine Fusion, die mehr ist als die Summe der Teile: Wo ein Radar nur „nichts“ sieht, kann das Lidar mit seiner hohen Auflösung dennoch ein Hindernis erkennen – und die gemeinsame Verarbeitung erzeugt ein robusteres Gesamtbild.

## Warum kommt der Wandel erst jetzt?

Den entscheidenden Impuls liefern **leistungsfähigere Chips und Schnittstellen**. Bisher lag das Know-how zur Radarsignalverarbeitung vor allem bei Tier-1-Zulieferern wie Bosch oder Continental. Sie lieferten fertig interpretierte Daten. Mit dem Aufkommen offenerer Plattformen (etwa NXP Radar Bridge oder TI AWR-Serie mit RAW-Unterstützung) können SoC-Hersteller nun die Signalverarbeitungs-IP direkt in ihren Chips integrieren. Dadurch wandert die **Algorithmen-Hoheit** vom Zulieferer zum Fahrzeughersteller.

Allerdings sind die Herausforderungen groß: Ein Radar mit 12 Anschlüssen benötigt ebenso viele SerDes-Leitungen. Zudem ist die Datenstruktur von Lidar und Radar völlig anders als die von Kameras – die für Kamerabilder optimierten MIPI-Schnittstellen sind kaum geeignet. Die Hersteller tasten sich daher an hybride Lösungen heran: Teilweise Vorverarbeitung im Sensor, dann Zusammenführung im Zentralrechner.

## Drei Sensortypen, drei Wege

**Millimeterwellenradar** entwickelt sich von 8T8R (acht Sende- und acht Empfangskanäle) zu 16T16R oder 24T24R. In China dominieren kosteneffiziente 8T8R-Lösungen mit einem SoC und zwei MMICs, während europäische Hersteller auf höhere Kanalzahlen setzen. Der Trend geht zu einer **Standardisierung**, die eine einheitliche Schnittstelle zur Rohdatenübertragung etabliert.

**Lidar** steht vor der größten Datenflut: Ein 192-Zeilen-Lidar erzeugt bereits 3,6 Gbit pro Sekunde – das entspricht in etwa einem unkomprimierten Full-HD-Videostream. Die Daten sind jedoch nicht als Kamerabilder organisiert, sondern als Slots mit Entfernung, Reflexionsgrad und Umgebungslicht. Herkömmliche DSPs stoßen hier an Grenzen, weshalb spezialisierte neuronale Netze auf dem SoC eingesetzt werden müssen.

**Ultraschallsensor** bleibt vergleichsweise einfach: Hier werden Laufzeitmessungen durchgeführt und die Echogramme zur zentralen Auswertung geschickt. BYD (比亚迪) etwa berichtet von einer **Reduzierung der Zeitverzögerung um knapp 20 %**, einer Erhöhung der Erkennungsreichweite um 20 % und einer zehnfach höheren **Auflösung der Umgebungsdichte**. Das Unternehmen setzt auf einen Mittelweg zwischen vollständig verteilter und zentralisierter Verarbeitung.

Die chinesische Automobilindustrie treibt diesen Wandel voran, um die **Kontrolle über die Wahrnehmungsalgorithmen** zu erlangen – und die Blackbox der Tier-1-Zulieferer zu öffnen. Je mehr Rohdaten verarbeitet werden können, desto besser lässt sich die Leistung auf Stufe 2, 3 und später Stufe 4 steigern.

*Quelle: Originalartikel zu dezentralen Fahrassistenzarchitekturen in China.*

---

Diese Technologieentwicklung betrifft die globale Automobilindustrie und hat keine direkte Auswirkung auf den deutschen Markt.
