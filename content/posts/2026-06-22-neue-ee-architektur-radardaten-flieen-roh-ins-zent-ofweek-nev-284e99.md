---
title: "Neue E/E-Architektur: Radardaten fließen roh ins Zentralhirn"
date: 2026-06-22T07:15:01.896Z
description: "Chinesische Autoindustrie stellt auf zentrale Rechner um. Radar-Rohdaten statt vorverarbeiteter Ziele – Algorithmus-Know-how wandert vom Tier‑1 zum OEM oder Chip-Entwickler."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 2
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Neue E/E-Architektur: Radardaten fließen roh ins Zentralhirn

Die „domänenzentrierte“ Fahrassistenz-Architektur breitet sich in China rasant aus. Statt dass jeder Radarsensor eigenständig Ziele erkennt und lediglich eine Objektliste ausspuckt, werden nun die rohen Zwischenfrequenzdaten per SerDes an eine zentrale Rechenplattform (SoC) übertragen. Erst dort erfolgt die Sensorfusion – das ermöglicht eine deutlich präzisere Umfeldwahrnehmung.

## Warum jetzt der Umbruch?
Bisher arbeiteten Millimeterwellen-Radare als „Blackbox“: Der Tier‑1 lieferte FFT-Spektren, Zielerkennung und Doppler-Schätzung fest in der Sensor-Firmware. Der OEM erhielt nur das Ergebnis – eine aufbereitete, bereits verzerrte Objektliste. Bei der neuen Architektur wandert die gesamte Signalverarbeitung auf den Zentralrechner. Der Sensor wird zum reinen „Rohdatengeber“ (MMIC + ADC + einfache 1D-FFT). Der Schritt ist erst durch leistungsfähigere SoCs und spezielle Schnittstellenchips (z. B. NXPs Radar Bridge) möglich.

Ein Beispiel: Trifft Radarstrahlen auf Wasser, streuen sie – ein herkömmliches Kamera-Radar-System würde widersprüchliche Meldungen liefern. Im zentralen Fusions-Algorithmus können die komplementären Rohdaten beider Sensoren intelligent verrechnet werden, sodass 1 + 1 deutlich mehr als 2 ergibt.

## Technische Hürden bleiben
*   **Millimeterwellen-Radar (4D):** Bisher dominieren 8T8R-Konfigurationen (ein SoC + zwei MMICs). Europa plant bereits 16T16R bis 24T24R. Die Algorithmus-IP wandert von Tier‑1 zu Chip-Herstellern wie NXP oder TI, die ihre Radar-Signalverarbeitungs-IP direkt in ADAS-SoCs integrieren.
*   **Laser-Radar (LiDAR):** Hier entfällt viel Signalverarbeitungs-Hardware (FPGA, DSP) im Sensor. Der reine Abtastkopf (Sender, SPAD-Empfänger, TDC) liefert Rohpunktwolken über MIPI an den Zentralrechner. Problem: LiDAR-Daten sind slot-basiert (ca. 1.200 Slots pro Frame), nicht frame-basiert wie Kameras. DSP-Einheiten sind darauf oft nicht optimiert.
*   **Ultraschall-Radar:** Die Laufzeitmessung ist trivial. In der zentralen Architektur steigt die Rechenlast im SoC um knapp 20 %, die Reichweite profitiert von feineren Korrelationsfiltern – bis zu 10 % mehr. Allerdings benötigt jeder Sensor eine eigene SerDes-Leitung.

BYD beispielsweise hat einen Mittelweg gewählt: Die Sensoren bündeln lokal vor, reichen dann aggregierte Daten an den Zentralrechner weiter – ein Kompromiss zwischen „volldezentral“ und „vollzentral“.

## Fazit
Die chinesische Autoindustrie durchbricht die Blackbox der Tier‑1-Zulieferer. Indem die Rohdaten aller Umfeldsensoren direkt in den Zentral-SoC fließen, können Algorithmen maximal flexibel und lernfähig entwickelt werden. Das beschleunigt den Weg vom assistierten (L2) zum hochautomatisierten Fahren (L3). Die Kontrolle über die Wahrnehmung liegt nun beim OEM oder Chip-Entwickler – nicht mehr beim Sensorhersteller.

---

## In Europa
Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
