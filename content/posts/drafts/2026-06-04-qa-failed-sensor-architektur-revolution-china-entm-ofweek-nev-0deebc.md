---
title: "[QA FAILED] Sensor-Architektur-Revolution: China entmachtet Zulieferer bei Fahrassistenz"
date: 2026-06-04T06:30:45.692Z
description: "Chinesische Hersteller setzen auf zentralisierte Sensorfusion: Rohdaten von Radar, Lidar & Co. werden direkt in einem leistungsstarken SoC verarbeitet. Tier-1-Zulieferer verlieren Algorithmen-Kontrolle."
source: "OFweek NEV"

category: "news"

brands: ["NXP", "TI", "BYD"]
tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Sensor-Architektur-Revolution: China entmachtet Zulieferer bei Fahrassistenz

Die chinesische Automobilindustrie treibt einen fundamentalen Wandel in der Fahrassistenz-Architektur voran. Statt dass jeder Sensor seine Daten lokal vorverarbeitet – etwa ein Radarsensor meldet „Hindernis in 50 Metern" –, werden künftig alle rohen Sensordaten direkt an eine zentrale Recheneinheit (SoC) gesendet. Diese „Zentralisierte Sensor-Rohdaten-Architektur" verschiebt die Kontrolle über die Algorithmen von den traditionellen Tier-1-Zulieferern zu den Fahrzeugherstellern und Chipproduzenten.

## Rohdaten statt Fertig-Ergebnisse

Bisher arbeitete jeder Sensor wie ein kleiner Computer: Eine Radareinheit führte Messungen, FFT-Berechnungen und Zielerkennung selbst durch und lieferte nur das abstrakte Ergebnis – etwa eine Liste von Zielobjekten. Dabei ging wertvolle Rohinformation verloren, etwa die Stärke des Echos oder Frequenzspektren. In der neuen Architektur liefern die Sensoren lediglich die unbehandelten Daten über leistungsfähige SerDes-Verbindungen an den Zentralrechner. Das ermöglicht eine deutlich bessere Sensorfusion: Statt sich auf widersprüchliche Meldungen verschiedener Sensoren zu verlassen, kann der Zentralalgorithmus alle Rohdaten zusammenführen – nach dem Prinzip „nicht 'wer hat recht?', sondern 'wer kann was besser?'".

## Millimeterwelle-Radar: Algorithmen-IP als Schlachtfeld

Bei Millimeterwellen-Radaren (MMW) ist der Wandel am weitesten fortgeschritten. Bisher lag die Signalverarbeitung komplett in der Hand von Tier-1-Lieferanten wie Bosch oder Continental: Sie bestimmten per Firmware, wie Ziele aus dem FFT-Spektrum extrahiert werden. Die neue Architektur entmachtet diese Blackbox: Der Radar-Chip (MMIC) sendet nur die Roh-IQ-Daten via MIPI oder GMSL an den ADAS-SoC. Damit die Algorithmen nicht bei den Zulieferern bleiben, bringen Chip-Hersteller wie NXP und TI dedizierte Radar-Bridge-ICs und integrieren Radar-Signalverarbeitungs-IP (RSP IP) direkt in ihre SoCs. Die Folge: Wer die IP kontrolliert, kontrolliert die Wahrnehmungsleistung.

## Lidar und Ultraschall: Unterschiedliche Herausforderungen

Beim Lidar ist die Umstellung komplexer. Hochauflösende Lidare mit 192 Zeilen liefern pro Sekunde 3,6 Gbit Rohdaten – vergleichbar mit einem Videostream. Die Datenstruktur (zeitliche Slots mit Punktwolken) unterscheidet sich fundamental von herkömmlichen Kamerabildern, die als Frames organisiert sind. Standard-MIPI-Schnittstellen, die für Kameras optimiert sind, können Lidar-Daten nicht effizient verarbeiten. DSP-Einheiten im SoC stoßen an ihre Grenzen. Zudem steigen die Anforderungen an die Rechenleistung drastisch: Statt einer Ziel-Liste muss der Zentralrechner jedes einzelne Punkt-Echo mit Zeitstempel, Intensität und Doppler-Information auswerten.

Ultraschallsensoren sind vergleichsweise einfach: Laufzeitmessung und Rohsignale lassen sich leicht übertragen. Allerdings benötigt jeder Sensor eine SerDes-Leitung – bei 12 Sensoren werden die Kabelbäume komplex und teuer. Ein Kompromiss ist die „dezentral-sammelnde" Variante: Eine kleine Vorverarbeitungseinheit in der Stoßstange aggregiert die Daten mehrerer Sensoren und sendet sie gebündelt an den Zentralrechner. BYD (比亚迪) verfolgt diesen Ansatz laut Branchenkreisen und erzielt damit 20 % mehr Rechenzeit für die Algorithmen, 20 % mehr Reichweite und eine zehnfach höhere Punktdichte.

## Europa vs. China: Zwei Wege beim Radar

Auch bei der Hardware gibt es unterschiedliche Strategien. China setzt bei 4D-Radar auf Kosteneffizienz: ein SoC mit zwei MMIC-Chips (8T8R). Europa geht den Hochleistungsweg: ein SoC mit vier MMIC-Chips (16T16R), teilweise sogar 24T24R geplant. Bis 2028 werden sich beide Wege gabeln – mit völlig unterschiedlichen Kostenmodellen und Anwendungsszenarien.

Fazit: Die chinesische Industrie möchte die gesamte Datenpipeline – vom Rohsignal bis zur Entscheidung – ohne Blackbox kontrollieren. Nur so können Algorithmen an der Datenqualität wachsen und die Lücke zum Level-2- und Level-3-Fahren schließen. Die Verschiebung der Kontrolle von Tier-1 zu OEMs und Chip-Designern ist ein strategischer Schritt, der die globale Wertschöpfungskette neu ordnet.

---

Die beschriebene technologische Entwicklung betrifft die globale Automobilindustrie und hat keine direkte Auswirkung auf ein in Deutschland erhältliches Modell. Es handelt sich um einen Branchentrend, der die Zukunft von Fahrassistenzsystemen prägen wird.
