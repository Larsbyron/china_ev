---
title: "Sensor-Revolution: China bricht die Blackbox der Zulieferer auf"
date: 2026-06-13T06:11:26.036Z
description: "Chinesische Hersteller forcieren die zentrale Sensorfusion: Lidar, Radar und Kamera liefern Rohdaten an ein SoC – ohne Vorverarbeitung. Das verlagert die Kontrolle von Tier‑1 zu Autoherstellern und verspricht bessere Assistenzsysteme."
source: "OFweek NEV"

category: "news"

brands: ["(keine spezifischen Marken)"]
tags: []
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Sensor-Revolution: China bricht die Blackbox der Zulieferer auf

## Vom verteilten Denken zur zentralen Intelligenz

Bisher arbeiteten Sensoren in Fahrzeugen weitgehend autark: Jeder Radar oder Lidar hatte einen eigenen Mikrocontroller, der aus den Rohdaten bereits eine „Zielerkennung" berechnete – eine stark komprimierte Liste von Objekten wurde an das Steuergerät gesendet. Dieses System filterte wertvolle Informationen bereits auf Sensor-Ebene weg. Die etablierten Tier‑1‑Zulieferer hielten die Algorithmen zur Signalverarbeitung als Blackbox unter Verschluss.

Jetzt setzt eine neue Architektur an: die zentrale Sensorfusion. Statt nur Objektlisten werden die vollständigen Rohdaten – etwa der unverarbeitete Doppler-Frequenzplot eines Radars oder die Punktwolke eines Lidars – über Hochgeschwindigkeitsschnittstellen (SerDes/GMSL) direkt an einen leistungsstarken ADAS-SoC gesendet. Dort vereint ein einheitlicher Fusionsalgorithmus alle Signale. Das Ergebnis: 1+1 kann 5 ergeben, weil die Stärken jedes Sensors kombiniert werden.

Ein Beispiel: Ein herkömmlicher Radar meldet „kein Hindernis", weil Regentropfen das Echo verschlucken. Ein Bildsensor sieht jedoch die entfernte Regenwand. In der alten Architektur entsteht ein Widerspruch. Mit der Zentralfusion gleicht der Algorithmus die Daten ab – nutzt die bessere Durchdringung des Radars für die Nahfeld-Korrektur und schafft ein konsistentes Umgebungsmodell.

## Warum jetzt? – Die Algorithmus-Kontrolle wechselt

Der Grund für diesen Wandel liegt in der Chip-Industrie. Das Infineon- oder NXP-Radar-Modul war jahrelang eine Blackbox. Die Signalverarbeitung (FFT, Zielerkennung, Doppler, Clustering) lag in der Firmware des Sensors. Jetzt aber drängen Halbleiter wie NXP mit dedizierten Radar-Bridge-Chips und RSP-IP (Radar Signal Processing IP) in den SoC. TI bietet mit seiner AWR-Serie bereits RAW-Daten-Ausgabe. So wird die Systemebene geöffnet: Der Autohersteller oder das Tech-Unternehmen übernimmt die Algorithmen.

Herausforderungen bleiben: Die Datenrate von 4D-Radaren (z. B. 8T8R) oder hochauflösenden Lidaren mit 192 Zeilen liegt bei über 3,6 Gbit/s pro Sensor. Die Anbindung über GMSL2 ist knapp, und die Datenorganisation (Slots statt Frames) passt nicht zur klassischen Camera-MIPI-Schnittstelle. Effiziente Verarbeitung auf dem SoC erfordert spezialisierte DSPs – CPU/GPU-Berechnung wäre zu langsam.

## Drei Wege für Radar, Lidar und Kamera

- **4D-Radar**: Zwei Wege zeichnen sich ab. Der chinesische Kostenpfad setzt auf 1 SoC + 2 MMIC (8T8R, 8 Sende-/8 Empfangskanäle). Der europäische Leistungspfad nutzt 1 SoC + 4 MMIC (16T16R) – bis zu 24T24R. Bis 2028 werden diese Architekturen miteinander konkurrieren.
- **Lidar**: Die Zentralarchitektur reduziert die Kosten, weil der teure FPGA im Sensor entfällt – nur Sender, SPAD-Empfänger und TDC bleiben. Die Daten werden über MIPI direkt an den SoC gegeben. Problem: Die Punktwolke besteht aus 1.200 Slots pro Frame – die Organisation ist nicht Frame-basiert, was DSP-Berechnungen auf dem SoC erschwert.
- **Kameras**: Hier ist der Wechsel am einfachsten, da Bildsensoren bereits Rohdaten liefern. Der Algorithmus profitiert von der feineren Verarbeitung – etwa durch Match-Filtering für bessere Bewegungserkennung. Allerdings steigt der Rechenaufwand um etwa 20 % bei gleicher Datenrate.

## Branchenweite Bedeutung

Diese Entwicklung markiert einen Machtwechsel: Die chinesische Automobilindustrie arbeitet daran, die Blackbox der Tier‑1-Zulieferer zu öffnen und die volle Kontrolle über die Datenpipeline zu übernehmen. Viele Hersteller testen bereits erste L2+- und L3-Systeme auf dieser Basis.

*Quelle: Branchenanalyse zur chinesischen Sensorarchitektur, basierend auf internen Entwicklungsprognosen.*

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
