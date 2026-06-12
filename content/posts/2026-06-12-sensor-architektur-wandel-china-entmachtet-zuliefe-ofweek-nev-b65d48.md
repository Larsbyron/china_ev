---
title: "Sensor-Architektur-Wandel: China entmachtet Zulieferer"
date: 2026-06-12T11:45:44.432Z
description: "Chinesische Auto-Startups setzen auf zentrale Sensorfusion: Statt jeder Sensor rechnet selbst, fließen Rohdaten direkt in einen Superchip. Das verändert die Wertschöpfungskette massiv."
source: "OFweek NEV"

category: "news"

brands: ["(keine spezifische Marke)"]
tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# Sensor-Architektur-Wandel: China entmachtet Zulieferer

## Rohdaten statt „kleiner Rechner“

Bislang verarbeitete jeder Radarsensor seine Signale selbst: Signal erfassen, FFT berechnen, Ziele erkennen – alles im Sensor. An die Zentrale ging nur ein „fertiges“ Objekt: „50 Meter vorne ein Hindernis“. Diese Architektur spart Datenbandbreite, aber verliert Nuancen.

Immer mehr chinesische Hersteller (NIO, XPeng, Li Auto) wechseln zur **zentralen Rohdaten-Architektur**: Jeder Sensor sendet unverarbeitete Rohdaten – etwa das vollständige FFT-Spektrum oder das Radar-RAW-Bild – über SerDes-Leitungen an eine zentrale Recheneinheit (SoC). Erst dort laufen Algorithmen zur Sensorfusion zusammen. Ergebnis: deutlich präzisere Umfelderkennung, etwa bei Regen, wo Millimeterwellen-Radar besser durchdringt als Kameras.

Der Preis: Statt 1+1=2 kann 1+1=5 werden – eine Fusion auf Rohdatenebene hebt das Potenzial jedes Sensors.

## Wer bekommt die Algorithmus-Hoheit?

Der Wandel hat eine Machtverschiebung zur Folge. Bisher lag das Signalverarbeitungs-Know-how bei den Tier-1-Zulieferern (Bosch, Continental, Huawei). Sie lieferten „Black-Box“-Module: fertige Sensoren mit fest verdrahteter Firmware. In der neuen Architektur wird der Sensor zum reinen „Rohdaten-Wandler“ – nur noch MMIC (Hochfrequenz-Chip) und ADC (Analog-Digital-Wandler) bleiben im Sensor. Die gesamte Intelligenz wandert in den ADAS-SoC.

Chip-Hersteller wie **NXP** und **TI** spielen dabei eine Schlüsselrolle: NXP bringt mit dem Radar Bridge einen speziellen Bridge-Chip, der zwischen MMIC und SoC vermittelt, und bietet parallel lizenzierbare Radar-Signalverarbeitungs-IP (RSP) für SoCs an. TI unterstützt ebenfalls RAW-Daten-Ausgabe seiner AWR-Serie. Die Frage ist: Wer kontrolliert die Algorithmen? Die Tier-1-Zulieferer oder die Autohersteller? In China tendiert die Branche klar zur Herstellerseite.

## Technische Hürden und zwei Wege bei 4D-Radar

Die Umstellung ist nicht trivial. Aktuelle 4D-Imaging-Radare folgen unterschiedlichen Pfaden:

*   **China-Weg:** Kostengünstig – ein SoC + zwei MMICs → 8T8R-Konfiguration.
*   **Europa-Weg:** Leistungsstärker – ein SoC + vier MMICs → 16T16R oder sogar 24T24R bis 2028.

Die Herausforderungen liegen nicht nur in der Hardware, sondern auch in der Software:

1.  Wer besitzt die Radar-Algorithmus-IP? Tier-1 oder Hersteller?
2.  Wer portiert und validiert die IP auf dem SoC? Aufwändig, da Radar-Rohdaten (3D-Frequenzgitter) anders organisiert sind als Kamerabilder (2D-Frames).
3.  Die Schnittstelle MIPI ist für Kameras optimiert – Radar-DSP-Einheiten müssen oft ineffizient über CPU/GPU laufen.

## Lidar und Ultraschall: Einfachere Integration, andere Probleme

**Lidar** eignet sich besonders gut für Rohdaten-Architekturen, weil der FPGA im Sensor ohnehin nur Vorverarbeitung macht. Lidar-Rohdaten – Punktwolken mit Entfernung, Winkel und Intensität – lassen sich leicht in eine zentrale Einheit streamen. Allerdings steigen Datenraten bei hochauflösenden 192-Linien-Lidaren auf 3,6 Gbit/s – GMSL2 reicht noch, aber die Rechenlast im SoC wächst enorm.

**Ultraschall** scheint einfach: Zeit-Laufzeit-Messung, keine komplexe Signalverarbeitung. Doch bei zentraler Verarbeitung steigt die CPU-Last um etwa 20 %, die Reichweite um fast 10 % (durch feinere Korrelationsfilter). Kabelkosten und Steckeranzahl (12 Sensoren, jeder mit SerDes) treiben den Preis.

Praktiker setzen oft auf einen Hybridansatz: Eine lokale Vorverarbeitung (z. B. hinter der Stoßstange) bündelt sechs Sensoren, sendet die aggregierten Daten dann zentral. BYD fährt eine optimierte Linie: 20 % mehr Latenz, 20 % mehr Reichweite, 10 % mehr Auflösung – ein Kompromiss zwischen „voll zentral“ und „voll dezentral“.

## Fazit: Chinas Autoindustrie entmachtet die Black Box

Die chinesische Industrie will die gesamte Datenpipeline kontrollieren – vom Rohsignal bis zur Entscheidung. Keine Black Box mehr. Nur mit voller Datenhoheit lassen sich die nächsten Stufen des automatisierten Fahrens (L3/L4) zuverlässig erschließen. Der Trend: Noch mehr Sensoren, noch mehr Rechenleistung – und noch mehr Eigenentwicklung bei den Herstellern.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt. Die beschriebene Technikentwicklung betrifft jedoch die gesamte Branche und wird auch europäische Zulieferer und Hersteller beeinflussen.
