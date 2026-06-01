---
title: "192-Linien-Lidar & 8T8R-Radar: Rohdaten-Revolution in China"
date: 2026-06-01T15:52:18.305Z
description: "Chinesische Hersteller setzen auf zentrale Sensorfusion: Statt gefilterter Einzeldaten fließen radare Rohsignale, Lidar-Punktwolken und Kamerabilder direkt in einen leistungsstarken SoC. Das verschafft der ADAS-Software völlig neue Qualität – und entmachtet traditionelle Tier-1-Zulieferer."
source: "OFweek NEV"

category: "news"


tags: ["Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# 192-Linien-Lidar & 8T8R-Radar: Rohdaten-Revolution in China

Die Zukunft des autonomen Fahrens liegt in einer zentralen Sensorarchitektur, bei der alle Umgebungssensoren – Millimeterwellenradar, Lidar und Kameras – ihre Rohdaten ungefiltert an ein einziges System-on-a-Chip (SoC) liefern. In China hat sich dafür der Begriff „vorverlagerte Sensorfusion“ (前融合) etabliert, was wörtlich „gute Integration im Voraus“ bedeutet. Diese Revolution verändert die gesamte Industriestruktur.

## Von dezentraler Intelligenz zur Einheit

Bisher arbeiteten Sensoren weitgehend autonom. Jeder Millimeterwellenradar besaß einen eigenen „Mini-Computer“, der im Sensor selbst die Signalverarbeitung (FFT, Zielerkennung, Doppler-Schätzung) durchführte. An die Zentrale wurden nur gefilterte Ergebnisse gemeldet – etwa „50 Meter voraus Hindernis“ oder „30 Meter links Fahrzeug“. Dabei gingen wertvolle Rohdaten verloren: Die Zentrale erhielt nur eine Liste angenommener Objekte, nicht die ursprüngliche Messung.

Die neue Zentralarchitektur ändert dies grundlegend: Radarsensoren übermitteln nun rohe FFT-Spektrum-Daten, Lidar liefert komplette 3D-Punktwolken, Kameras senden RAW-Bilder – alles über leistungsfähige SerDes-Verbindungen (z. B. GMSL) an einen einzigen ADAS-SoC. Dort laufen die Daten in einem einheitlichen Koordinatensystem zusammen. Das System kann echte Sensorfusion betreiben: Wo ein Radar starke Reflexionen durch Wassernebel liefert, das Lidar aber schwache, kombiniert es die Stärken beider Sensoren. So wird 1+1 nicht gleich 2, sondern gleich 5.

## Warum jetzt erst? – Algorithmen-Know-how wechselt den Besitzer

Der Grund für diesen Wandel: Traditionell lag das Signalverarbeitungs-Know-how für Radarsensoren bei den Tier-1-Zulieferern wie Bosch oder Continental. Diese verpackten die Algorithmen in Black-Box-Firmware direkt im Sensor. Die Automobilhersteller bekamen nur die fertigen Ergebnisse, nicht aber die Möglichkeit, die Rohdaten selbst zu interpretieren.

Die Zentralarchitektur kehrt dieses Modell um: Der Sensor liefert nur noch die nackten Rohdaten – die digitale Zwischenstufe entfällt. Chiphersteller wie NXP bringen spezielle „Radar Bridge“-Chips auf den Markt, die zwischen MMIC (Hochfrequenz-Baustein) und SerDes vermitteln. Gleichzeitig integrieren SoC-Anbieter eigene Radar-Signalverarbeitungs-IP (RSP) direkt in ihre ADAS-Chips. NXP verfolgt eine offene Lizenzstrategie für seine RSP-IP, um eine breite Plattformadaption zu erreichen. Auch TI unterstützt mit seinen AWR-Serien-Radar-Chips den Rohdaten-Export.

Diese Entwicklung ermöglicht erst L3/L4-Niveaus: Statt listenartiger Objektlisten benötigen autonome Systeme für komplexe Szenarien – etwa eine Person, die ein Fahrrad hinter einem stehenden Lkw herschiebt – rohe Abstands-Doppler-Spektren. Nur so lassen sich Objekte wie nasse Straßenreflexionen von echten Hindernissen unterscheiden.

## Drei Sensortypen im Vergleich

**Millimeterwellenradar:** Am weitesten entwickelt, aber auch am schwierigsten umzustellen. Im Markt zeichnen sich zwei Wege ab: Chinesische Hersteller setzen auf eine kosteneffiziente 8T8R-Konfiguration (ein SoC + zwei MMIC), europäische Tier-1 planen 24T24R mit vier MMIC. Bis 2028 werden sich die Wege trennen – völlig unterschiedliche Kostenmodelle und Einsatzszenarien.

**Lidar:** Die Umstellung ist einfacher, weil der Sensor selbst weniger Vorverarbeitung benötigt. Besonders ambitioniert: 192-Linien-Lidar mit 10 Hz Bildrate, horizontal 120° Sichtfeld und 0,1° Auflösung. Jeder Scan liefert 3,6 Gbit/s – das überfordert selbst GMSL2 (6 Gbit/s) nicht, aber die SoC-seitige Verarbeitung wird zur Herausforderung, weil die Datenstruktur (Slots statt Frames) völlig anders ist als bei Kameras.

**Ultraschall:** Bleibt einfach, aber die Rohdaten-Übertragung ist aufwändig: 12 Sensoren bedeuten 12 separate SerDes-Leitungen, was Kosten und Anschlüsse sprunghaft erhöht. Die praktische Lösung ist eine hybride Architektur: lokale Vorverarbeitung an der Stoßstange, dann gebündelte Übertragung zur Zentrale.

BYD (比亚迪) hat beispielsweise bei seinen neueren Fahrzeugen eine solche hybride Vorverarbeitungsstufe eingeführt – die Rechenlast in der Zentrale sinkt um fast 20 %, die Messdichte steigt um das Zehnfache. Das schafft einen Mittelweg zwischen „voll zentral“ und „voll dezentral“.

## Fazit: Das Ende der Black Box

Die chinesische Automobilindustrie baut an einer neuen Datenpipeline – vom rohen Sensorsignal direkt zur Entscheidungslogik, ohne undurchsichtige Zwischenschritte. Nur wenn genügend Rohdaten zur Verfügung stehen, können Algorithmen ihre volle Leistung entfalten. Mit der Umstellung auf zentrale Architekturen werden erst L2+- und L3-Funktionen in Serie machbar. Der Technologiewettlauf um die beste Sensorfusion hat gerade erst begonnen.

---

(entfällt – reine Technologienachricht ohne Modellbezug)
