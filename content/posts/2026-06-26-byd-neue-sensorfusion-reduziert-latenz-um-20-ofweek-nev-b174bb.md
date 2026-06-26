---
title: "BYD: Neue Sensorfusion reduziert Latenz um 20 %"
date: 2026-06-26T12:09:52.296Z
description: "Die chinesische Autoindustrie stellt die Fahrassistenz-Architektur um: Statt Blackbox-Daten liefern Sensoren rohe Signale direkt an die Zentrale. BYD zeigt beeindruckende Werte – auch für Europas Premiumhersteller relevant."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD: Neue Sensorfusion reduziert Latenz um 20 %

## Vom Blackbox-Prinzip zur Rohdaten-Fusion

Die chinesische Automobilindustrie erlebt einen grundlegenden Wandel in der Architektur ihrer Fahrassistenzsysteme. Bisher arbeitete jedes Radar oder Lidar wie eine „Blackbox": Der Sensor verarbeitete seine Signale selbstständig – von der Erfassung über die FFT-Berechnung bis zur Zielerkennung – und lieferte nur aggregierte Daten an das zentrale Steuergerät. Dieses bekam etwa die Meldung „50 Meter voraus Hindernis", aber keine rohen Messwerte.

Die neue Denkrichtung heißt *domänenübergreifende Sensorfusion*: Alle Sensoren – Millimeterwellen-Radare (Radar im mm-Wellenbereich), Lidar (Laser-Radar) und Ultraschallsensoren – geben ihre rohen Signale über leistungsfähige SerDes-Verbindungen direkt an einen zentralen Rechenknoten (SoC). Dort läuft ein einheitlicher Fusionsalgorithmus, der die Informationen aller Sensoren in Echtzeit kombiniert.

## Warum jetzt? – Algorithmen-Hoheit wechselt von Tier‑1 zu OEM

Der Treiber dieses Umbruchs ist der Kampf um die Algorithmen-Hoheit. Bisher besaßen Tier‑1-Zulieferer wie Bosch oder Continental das Know-how für die Signalverarbeitung in Radaren – etwa die FFT-Frequenzanalyse oder die Doppler-Berechnung. Die OEMs bekamen nur verarbeitete, bereits gefilterte Ergebnisse.

Mit der neuen Architektur verlagert sich die Intelligenz auf die zentrale SoC-Plattform. Die Zulieferer liefern nur noch den reinen Hardware-Rohling (MMIC + ADC), die gesamte Signalverarbeitung übernimmt der OEM oder ein Chip-Entwickler wie NXP oder TI. NXP hat dafür sogar einen speziellen Bridge-Chip („Radar Bridge") und integriert Radar-Signalverarbeitungs-IP direkt in ADAS-SoCs. Auch TI unterstützt mit seinen AWR-Radar-Chips den RAW-Ausgang.

Der Vorteil: Für höhere Autonomiestufen (L3/L4) reichen listenartige Zielmeldungen nicht mehr aus. Man braucht rohe Entfernungs-Doppler-Spektren, um schwache Punkte wie ein Motorrad am Straßenrand oder einen überdeckten Stein zu erkennen. Reine Punktelisten würden solche Details wegfiltern.

## Lidar, Radar, Ultraschall – drei Wege, ein Ziel

### Millimeterwellen-Radar: günstig, aber schwer zu fusionieren

4D-Radare nutzen heute meist einen SoC plus zwei MMICs (8T8R). Europas Hersteller planen 16T16R oder gar 24T24R. Bis 2028 werden sich 8T8R- und 24T24R-Route trennen. Die größte Hürde: Algorithmen-IP für Radare ist kaum plattformneutral – und die SoCs sind oft für Kameras optimierte MIPI-Schnittstellen, nicht für radartypische Datenstrukturen.

### Lidar: richtige Fusion spart Geld

Lidar benötigt intern oft teure FPGAs zur Signalverarbeitung. In einer Rohdaten-Architektur kann man diese Kosten einsparen – die Verarbeitung wandert auf den zentralen SoC. Allerdings sind Lidar-Daten (z. B. 192 Zeilen, 10 Hz, 120° FOV) mit etwa 3,6 Gbit/s datenintensiv. Die GMSL2-Verbindung reicht zwar (6 Gbit/s), doch die Datenstruktur (Slot-basiert statt Frame-basiert) passt nicht zur Kamera-orientierten MIPI-Schnittstelle – das bremst die DSP-Effizienz.

### Ultraschall: einfach, aber Kabelchaos

Ultraschallsensoren sind algorithmisch simpel, aber bei 12 Sensoren entstehen 12 SerDes-Kabel. Eine praktische Lösung ist „zonenweise Vorverarbeitung + zentrale Fusion" – so reduziert BYD die Latenz um fast 20 %, erhöht die Reichweite um 20 % und steigert die Punktdichte um das Zehnfache. Diesen Mittelweg zwischen vollständiger Dezentralisierung und vollständiger Zentralisierung verfolgen viele chinesische Hersteller.

## Fazit: China treibt die Öffnung der Blackbox voran

Die chinesische Autoindustrie zwingt die Zulieferer, ihre Blackbox zu öffnen: Nur wer rohe Signale liefert, ermöglicht OEMs die volle Kontrolle über die Algorithmen. Während Europas Hersteller noch auf geistiges Eigentum von Tier‑1 angewiesen sind, setzen chinesische Firmen wie BYD neue Maßstäbe – mit messbaren Vorteilen bei Latenz, Reichweite und Detailtreue. Das wird den Wettbewerb in der autonomen Fahrt der nächsten Generation (L2/L3) neu definieren.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
