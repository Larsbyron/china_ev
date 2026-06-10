---
title: "[QA FAILED] Neue Sensor-Architektur: Rohdaten statt Blackbox"
date: 2026-06-10T12:51:28.788Z
description: "Chinesische Hersteller setzen bei Fahrassistenz auf zentrale Rohdatenverarbeitung statt lokaler Vorfilterung. Die neue Architektur verspricht bessere Sensorfusion für autonomes Fahren und verschiebt Machtverhältnisse zwischen OEMs, Tier-1 und Chip-Anbietern."
source: "OFweek NEV"

category: "news"

brands: ["NXP", "Texas Instruments"]
tags: ["Reichweite", "Hybrid", "Autonomes Fahren"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Neue Sensor-Architektur: Rohdaten statt Blackbox

## Vom dezentralen zum zentralen Denken

Bislang arbeiteten Sensoren wie Radar oder Lidar als geschlossene Blackboxen: Jeder Sensor filtert und verdichtet die Rohdaten lokal, sendet nur das Ergebnis – „Objekt in 50 Metern“ – an das Steuergerät. Das spart Rechenleistung im Zentralcomputer, aber vernichtet wertvolle Details. Bei schwierigen Situationen – etwa Regen, der einen Radarstrahl streut – entstehen widersprüchliche Meldungen: „Radar sieht Hindernis, Kamera nicht“. Die alte Architektur kann diese Konflikte nicht auflösen.

Die neue „entkoppelte“ Sensor-Architektur dreht den Spieß um: Statt gefilterter Zielobjekte liefern die Sensoren nun ihre Rohdaten – bei Radar etwa das FFT-Frequenzspektrum oder das „Radar-RAW-Bild“ – an eine zentrale Recheneinheit (SoC). Dort laufen alle Daten aus Kameras, Radar, Lidar und Ultraschall in einheitlichen Algorithmen zusammen. Das Ergebnis: echte Sensorfusion, die auch komplexe Szenen versteht – etwa einen Fußgänger hinter einem Fahrzeug, den nur das Radar, nicht aber die Kamera sieht.

## Warum erst jetzt? – Der Machtwechsel bei der Radar-Algorithmik

Der Grund für die späte Umstellung: Bisher hielten Tier-1-Zulieferer das Know-how zur Radarsignalverarbeitung fest in der Hand. Algorithmen für FFT-Zielerkennung, Rauschfilterung oder Doppler-Geschwindigkeit waren in der Firmware des Radarprozessors vergraben – eine Blackbox, die kein OEM öffnen konnte.

Die Entkopplung erfordert neue Chip-Architekturen: NXP hat mit dem „Radar Bridge“ einen speziellen Bridge-Chip vorgestellt, der zwischen dem analogen MMIC (Hochfrequenz-Chip) und dem digitalen SoC sitzt. Gleichzeitig integriert NXP erste Radarsignalverarbeitungs-IP (RSP IP) direkt in seine ADAS-SoC-Plattform. Auch Texas Instruments (TI) geht diesen Weg: Seine AWR-Serie unterstützt bereits RAW-Datenausgabe. Für höhere Automatisierungsstufen (L3/L4) reichen gefilterte Zielobjekte nicht mehr aus – Rohdaten sind Pflicht.

Allerdings steigt die Rechenlast massiv: Ein SoC muss 12 Radar-Kanäle gleichzeitig per FFT und CFAR verarbeiten. Ohne spezialisierte DSP-Hardware ist das kaum zu bewältigen.

## Drei Sensor-Typen, drei Wege

**Millimeterwellen-Radar (4D-Imaging-Radar):** Hier konkurrieren zwei Strategien. Der günstige chinesische Weg setzt auf „1 SoC + 2 MMIC“ (6 Tx / 8 Rx), was 8T8R ergibt. Europa plant hingegen „1 SoC + 4 MMIC“ (12 Tx / 16 Rx = 16T16R), teilweise sogar 24T24R bis 2028. Entscheidend ist nicht die Hardware, sondern die Algorithmik: Wer besitzt die Radar-IP? Und wer kann sie effizient auf dem SoC portieren? Zudem sind Radar-Daten anders organisiert als Kamerabilder – MIPI-Schnittstellen müssen angepasst werden.

**Lidar:** Hier lohnt sich die Entkopplung besonders, da der FPGA-basierte Signalprozessor im Lidar einen hohen Kostenanteil ausmacht. Wird die Verarbeitung ins Zentral-SoC verlagert, sinken die Kosten für die Lidar-Einheit spürbar. Bleiben nur Sendeeinheit, SPAD-Empfänger und TDC-Zeitmessung – der Rest übernimmt der Zentralrechner. Allerdings sind Lidar-Daten (10 Hz, 120° Sichtfeld, 0,1° Auflösung) mit rund 3,6 Gbit/s pro Sekunde enorm datenintensiv. Die Übertragung über GMSL2 ist knapp, der Rechenaufwand im SoC hoch. Zudem unterscheidet sich die Datenstruktur (Slots statt Frames) fundamental von Kameras.

**Ultraschall-Sensoren:** Die Verarbeitung ist einfach – sie nutzen Laufzeitmessung. Durch die Entkopplung steigt die Rechenlast im Zentralrechner um etwa 20 %, dafür kann die Reichweite um bis zu 10 % gesteigert werden (sagte BYD in einer Präsentation). Praktisch setzt sich ein Hybrid-Modell durch: Lokale Vorverdichtung plus zentrale Nachverarbeitung. BYD spricht von einer „halben Dezentralisierung“ – die Vorteile der Rohdaten-Architektur bleiben erhalten, ohne die Verkabelung zu explodieren.

## Fazit

Die chinesische Autoindustrie treibt den Trend zur transparenten Sensordaten-Pipeline: Vom Rohsignal bis zur Entscheidung gibt es keine Blackbox mehr. Das verspricht bessere Leistung für autonomes Fahren – aber es verschiebt auch die Machtverhältnisse: Tier-1-Zulieferer verlieren ihre algorithmische Kontrolle, Halbleiter-Hersteller wie NXP und TI gewinnen an Einfluss. Der Wettlauf um die beste Sensor-IP für L2+ und L3 hat begonnen.

---

Dieser Artikel behandelt eine branchenweite technologische Entwicklung. Es wird kein spezifisches Fahrzeugmodell genannt. Die beschriebenen Architekturänderungen betreffen Hersteller und Zulieferer weltweit, darunter auch deutsche OEMs und Tier-1-Unternehmen.
