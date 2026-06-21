---
title: "BYD: Zentrale Sensorfusion spart 20 % Zeit, erkennt 400 m weit"
date: 2026-06-21T06:47:39.343Z
description: "Die chinesische Autoindustrie setzt auf zentrale Rohdatenverarbeitung statt getrennter Sensoren. BYD (比亚迪) meldet 20 % mehr Radar-Reichweite und zehnfache Punktdichte – ein Paradigmenwechsel für autonomes Fahren."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD: Zentrale Sensorfusion spart 20 % Zeit, erkennt 400 m weit

Die chinesische Automobilindustrie vollzieht einen grundlegenden Wandel in der Sensorarchitektur für Fahrassistenzsysteme. Statt jeder Sensor seine eigene Signalverarbeitung betreibt, bündeln immer mehr Hersteller die Rohdaten mehrerer Sensoren in einer zentralen Recheneinheit. Ziel: eine präzisere Umfeldwahrnehmung für autonomes Fahren – und eine Verlagerung der Algorithmen-Kompetenz von Tier-1-Zulieferern hin zu OEMs und Chipherstellern.

BYD (比亚迪) gilt als Vorreiter dieser Entwicklung. Der Hersteller hat die neue Architektur bereits in mehreren Serienmodellen implementiert – darunter die Baureihen Han und Seal. Offizielle Angaben beziffern die Vorteile auf bis zu 20 Prozent geringere Latenz, 20 Prozent mehr Erkennungsreichweite (bis zu 400 Meter für das 4D-Millimeterwellenradar) und eine zehnfach höhere Punktdichte. Damit sollen Fahrzeuge selbst unter schwierigen Bedingungen wie Regen oder Spritzwasser zuverlässiger Hindernisse identifizieren können.

## Warum die alte Architektur an ihre Grenzen stößt

Bisher arbeiteten Millimeterwellen-Radare, Lidar und Kameras weitgehend isoliert. Jeder Radarsensor führte selbst die gesamte Signalverarbeitung durch – von der FFT (Fast Fourier Transformation) bis zur Zielerkennung. An die zentrale Steuereinheit wurden lediglich „abgeschlossene" Ergebnisse wie „50 m voraus ein Hindernis" übermittelt. Das Problem: Die Daten wurden bereits gefiltert und komprimiert, wertvolle Rohinformationen gingen verloren.

In der zentralen Sensorfusions-Architektur speisen die Sensoren dagegen unverarbeitete Rohdaten in einen leistungsstarken ADAS-SoC (System on Chip) ein. Dieser vereint die Informationen aller Sensoren und kann Widersprüche auflösen. Beispiel: Spritzwasser auf der Straße stört die Sicht eines Millimeterwellen-Radars – ein Lidar-Sensor sieht durch die Gischt jedoch klar. Im alten System meldete Radar „kein Hindernis", Lidar „Hindernis" – die Zentrale hätte nicht gewusst, wem sie glauben soll. In der neuen Architektur kombiniert ein einziger Algorithmus die Rohdaten und erkennt: Es handelt sich um Wasser, nicht um ein festes Objekt. Das Ergebnis: 1+1 kann plötzlich 5 ergeben.

## Algorithmus-Know-how wandert vom Tier-1 zum OEM

Der Schlüssel liegt in der Verlagerung der Radarsignalverarbeitung. Bisher war das gesamte Know-how – wie man Ziele aus FFT-Spektren extrahiert, Rauschunterdrückung betreibt und Geschwindigkeiten schätzt – in der Firmware des Radarsensors verborgen. Tier-1-Zulieferer wie Bosch oder Continental behielten ihre Algorithmen als Blackbox. OEMs bekamen nur das fertige Ergebnis, nicht den Rohstoff.

Die zentrale Architektur zwingt die Industrie zur Öffnung: Der Sensor liefert nur noch die rohen ADC-Daten (Analog-Digital-Wandlung) und eine erste 1D-FFT. Die gesamte hochkomplexe Signalverarbeitung übernimmt der ADAS-SoC. Chiphersteller wie NXP haben dafür spezielle Radar-Bridge-Chips und lizenzierbare Radar-Signalverarbeitungs-IP (RSP IP) entwickelt. TI folgt ähnlichen Pfaden. So entsteht ein neuer Markt für Algorithmen: OEMs können entweder eigene Lösungen entwickeln oder auf skalierte IP von Chip-Firmen setzen. Die Frage „Wer hat die Algorithmen?" entscheidet künftig über die Wertschöpfung entlang der Lieferkette.

## Bedeutung für den E-Auto-Markt

Die zentrale Sensorfusion ist kein reines Technologie-Feature mehr – sie wird zum entscheidenden Wettbewerbsfaktor für chinesische E-Autos. Denn erst mit der Fähigkeit, aus Rohdaten aller Sensoren ein konsistentes Umfeldmodell zu errechnen, lassen sich höhere Automatisierungsstufen (L2+ bis L3) zuverlässig realisieren. BYD hat diesen Schritt bereits vollzogen und gibt damit die Richtung vor. Andere chinesische Hersteller wie NIO (蔚来), XPeng (小鹏) oder Li Auto (理想) werden folgen müssen, um im Rennen um intelligente Fahrassistenzsysteme nicht zurückzufallen. Für europäische Kunden bedeutet das: Die nächste Generation chinesischer E-Autos bietet nicht nur günstige Preise, sondern auch eine technologisch überlegene Sensorplattform – mit Potenzial für deutlich sichereres und autonomeres Fahren.

---

Die Technologie ist in China bei BYD bereits in Serienmodellen wie Han und Seal verbaut. Ein Marktstart dieser Fahrzeuge in Deutschland ist für 2025/2026 avisiert. Die Sensorarchitektur selbst ist eine Branchenentwicklung, die weltweit Einzug halten wird.
