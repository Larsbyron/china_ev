---
title: "Radar-Lidar-Fusion: Chinas neue Zentralarchitektur für ADAS"
date: 2026-06-21T19:20:02.923Z
description: "Chinesische Hersteller stellen auf zentrale Sensor-Verschmelzung um: Statt vorverarbeiteter Daten liefern Radar, Lidar und Kamera künftig Rohsignale an einen Zentralrechner. Das verschiebt die Macht von Tier-1-Zulieferern zu SoC-Entwicklern – Schlüssel für künftiges Level 3."
source: "OFweek NEV"

category: "news"


tags: ["Hybrid", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Radar-Lidar-Fusion: Chinas neue Zentralarchitektur für ADAS

Die chinesische Autoindustrie vollzieht einen grundlegenden Wandel in der Architektur für Fahrassistenzsysteme und autonomes Fahren. An die Stelle des bisherigen dezentralen Ansatzes mit eigenen Signalprozessoren in jedem Sensor tritt eine zentrale Rechnerstruktur: Die Sensoren liefern nicht länger gefilterte Objektlisten, sondern die rohen, unverarbeiteten Messdaten an einen zentralen ADAS-SoC (System-on-a-Chip). Dieser übernimmt dann die gesamte Sensorfusion – Algorithmen wie FFT und CFAR wandern vom Sensor in die zentrale Recheneinheit.

## Hintergrund: Warum jetzt der Umbruch?

Bisher verarbeitete jeder Millimeterwellen-Radarsensor eigenständig die Signale: von der FFT (Fast-Fourier-Transformation, Umrechnung von Zeitsignalen in Frequenzbereiche) über die Zielerkennung bis zur Geschwindigkeitsmessung. Die Ergebnisse gingen als „vorverarbeitete Objektliste“ an das Steuergerät – ein Informationsverlust, der die Güte der Fusion begrenzt. Künftige Level 3/4-Systeme benötigen jedoch eine höher aufgelöste Umfeldwahrnehmung. Deshalb setzt die Industrie auf die zentrale Rohdaten-Architektur (engl. central raw data architecture): Jeder Rohdatenstrom – etwa die zeitlich-kontinuierlichen Frequenzspektren bei Radaren, die zeitaufgelösten Echos bei Lidaren oder die Graustufenwerte bei Kameras – wird direkt dem SoC zugeführt, der die Daten auf einer gemeinsamen Zeitbasis fusioniert.

## Algorithmen-IP: Machtwechsel von Tier-1 zu Chip-Herstellern

Die Schlüsselfrage lautet: Wer besitzt künftig die Algorithmen? Bisher lagen die Signalverarbeitungsroutinen für Millimeterwellenradare als Blackbox in den Firmware der Tier-1-Zulieferer. Zentralrechner-Architekturen verlagern diese IP in den SoC. Chip-Hersteller wie NXP drängen mit dedizierten IP-Blöcken (z. B. Radar-RSP-IP) in diese Lücke. NXP hat eine spezielle Radar Bridge entwickelt, eine Schnittstelle zwischen MMIC (monolithisch integrierte Mikrowellenschaltung) und SerDes (Serializer/Deserializer, serielles Datenübertragungsverfahren). Texas Instruments (TI) unterstützt bei seiner AWR-Radar-Chipsatz-Serie bereits den Rohdaten-Modus. Der Wettbewerb um die Algorithmen-Kompetenz entscheidet über die künftige Wertschöpfung.

## Die drei Sensortypen im Detail

**Millimeterwellen-Radar (4D-Radar):** Die bisher dominierende 8T8R-Architektur (8 Sende-, 8 Empfangskanäle) reicht für Level 3 nicht aus. In China setzt man auf eine kosteneffiziente Route mit 1 SoC + 2 MMICs für 8T8R. Europa geht mit 1 SoC + 4 MMICs für 16T16R, perspektivisch sogar 24T24R. Bis 2028 werden beide Pfade existieren – abhängig von der Kostenmodell- und Anwendungsebene.

**Lidar (Laserscanner):** Lidar profitiert besonders von der Zentralarchitektur, da der teure FPGA (programmierbarer Logikchip) zur Signalverarbeitung entfällt. Der Sensor beschränkt sich auf Sender (VCSEL), SPAD (Einzelphotonen-Lawinendiode) und TDC (Zeit-Digital-Wandler) – die Rohdaten werden über MIPI (Standardschnittstelle) an den SoC übertragen. Die Datenstruktur des Lidars (z. B. 192 Zeilen, 10 Hz, 120° horizontal) ähnelt einem Videostream: 3,6 Gbit/s pro Sensor – gut beherrschbar mit GMSL2.

**Ultraschallsensor:** Der bisher einfachste Sensortyp bringt in der Zentralarchitektur eine erhöhte Zeitlast von rund 20 % mit sich. Dafür kann der SoC durch feinere Korrelation mehr Informationen wie Lampenmasten oder Bordsteine erkennen. Da viele Sensoren (oft 12) nötig sind, setzt sich eine hybride Architektur durch: Sensoren sammeln lokal Daten an der Stoßstange, bündeln sie und senden gebündelt an die Zentrale – so vermeidet man den „Kabelwurm“ aus 12 separaten Leitungen.

## Fazit

Die chinesische Automobilindustrie treibt die Demokratisierung der Rohdaten voran. Statt Blackbox-Zulieferer entscheiden in Zukunft die SoC-Hersteller und die Algorithmus-Kompetenz der OEMs. Der Wechsel von der dezentralen zur zentralen Architektur markiert einen tiefgreifenden Wandel in der Wertschöpfungskette – und bereitet den Weg für zuverlässigere Level-3-Funktionen.

---

## In Europa
Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
