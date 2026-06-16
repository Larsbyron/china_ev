---
title: "[QA FAILED] China treibt Zentralarchitektur: Radar-Rohdaten direkt ins Gehirn"
date: 2026-06-16T14:55:50.437Z
description: "Chinesische Hersteller forcieren zentralisierte Sensorarchitektur: Statt gefilterter Daten liefern Radare und Lidare künftig Rohsignale direkt an die KI – Machtwechsel in der Lieferkette."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] China treibt Zentralarchitektur: Radar-Rohdaten direkt ins Gehirn

Die chinesische Autoindustrie leitet einen grundlegenden Wandel ein: Weg von dezentralen, eigenständig rechnenden Sensoren, hin zu einer zentralen Fahrassistenz-Architektur. Dabei werden die Rohdaten aller Umfeldsensoren direkt an eine leistungsstarke Recheneinheit geschickt – das Auto bekommt ein einheitliches „Gehirn".

Bislang arbeiteten Millimeterwellen-Radare, Lidare und Ultraschallsensoren weitgehend autark: Jeder Sensor wertete seine Messungen mit einem eigenen Mikrochip aus und meldete nur das Ergebnis – etwa „Objekt in 50 Metern Entfernung" – an das Zentralsteuergerät. Diese gefilterten Reports waren praktisch, aber arm an Information, verloren Nuancen wie die Streuung von Radarwellen an Wasser oder diffuse Reflexionen.

## Zentralisierung: Rohdaten statt Ergebnis-Liste

Die neue Architektur kehrt dieses Prinzip um: Der Sensor übernimmt nur noch minimale Vorverarbeitung – bei Radaren eine eindimensionale Fourier-Transformation (1D-FFT) – und schickt die unverarbeiteten Rohdaten über Hochgeschwindigkeits-Links wie GMSL oder SerDes an den zentralen ADAS-SoC (System-on-a-Chip). Dort läuft eine einheitliche Fusions-Algorithmik, die alle Sensorströme zeitlich und räumlich zusammenführt.

Der Vorteil: Statt Widersprüche zwischen verschiedenen Sensoren selbst ausbügeln zu müssen („Millimeterwellen-Radar sagt kein Hindernis, Kamera-Radar sagt Hindernis"), kann die KI in der Zentrale die komplementären Stärken kombinieren. Ein Millimeterwellen-Radar durchdringt Regen, eine Lidar-Kamera liefert hochauflösende Umrisse – erst die Rohdatenfusion ermöglicht eine robuste Umfeldinterpretation für höhere Autonomiestufen.

## Warum jetzt? Der Kampf um die Algorithmen

Der Wandel wird durch zwei Entwicklungen ermöglicht: Einerseits bringen neue Chips Hersteller wie NXP spezielle Radar-Bridge-Bausteine oder integrieren Radar-Signalverarbeitungs-IP (RSP) direkt in ADAS-SoCs. TI unterstützt auf seiner AWR-Serie ebenfalls RAW-Daten-Ausgabe. Andererseits benötigen L3/L4-Systeme eine granularere Umfeldwahrnehmung – gefilterte Objektlisten reichen nicht mehr aus.

Dahinter steckt eine strategische Machtverschiebung: Bisher kontrollierten Tier-1-Zulieferer wie Bosch oder Continental die Radar-Algorithmen als Blackbox. Die Rohdaten-Architektur gibt diese Kontrolle an die Fahrzeughersteller oder an Chip-Entwickler ab. Wer die zentrale Fusions-Software beherrscht, bestimmt über die Qualität des autonomen Fahrens – ein milliardenschwerer Hebel.

## Drei Sensortypen, drei Herausforderungen

**Millimeterwellen-Radar (4D):** Die Hardware entwickelt sich rasant. Kostengünstige chinesische Lösungen setzen auf 1 SoC + 2 MMIC (8T8R), europäische Anbieter auf 1 SoC + 4 MMIC (16T16R) oder sogar 24T24R. Entscheidend ist die Software-IP: Wer den Algorithmus liefert – Tier-1 oder Hersteller – bestimmt die künftigen Margen.

**Laser-Radar (Lidar):** Die Rohdaten-Architektur ist hier am einfachsten. Statt teurer FPGAs im Sensor sendet die Lidar-Einheit nur noch Sendedioden, SPAD-Empfänger und Zeit-Digital-Wandler. Die Punktwolke wird direkt über MIPI zum SoC übertragen – ähnlich wie bei Kameras. Allerdings: Die Datenstruktur (3D-Punktwolke statt 2D-Raster) erfordert angepasste DSP-Einheiten.

**Ultraschall-Radar:** Hier führen die Rohdaten zu deutlichen Fortschritten. Statt einfacher Laufzeitmessung liefern Rohdaten eine korrelationsbasierte Feinschätzung. Die chinesische Firma Hesai (禾赛) berichtet von 20 % weniger Totzeit, 20 % mehr Reichweite und zehnmal höherer Dichte. Der Trade-off: 12 Sensoren benötigen 12 SerDes-Leitungen – teuer. Praktikable Lösungen setzen auf eine Mischung aus lokaler Vorverarbeitung und zentraler Endauswertung.

## Fazit: Chinas Industrie will die Datenhoheit

Die chinesische Automobilindustrie treibt eine Architektur-Revolution voran: Weg von Blackbox-Sensoren, hin zu offenen Datenpfeifen, in denen rohe Sensorinformationen ungefiltert fließen. Wer die Algorithmen zur Auswertung dieser Daten besitzt, besitzt die Macht im Zeitalter des automatisierten Fahrens. Kameras waren der Anfang – künftig werden Radare und Lidare folgen.

---

Diese Analyse betrifft die globale Industrie und Technologieentwicklung. Deutsche Hersteller und Zulieferer reagieren ebenfalls auf diesen Trend: Bosch und Continental arbeiten an offeneren Sensorplattformen, während Volkswagen über eigene Software-Tochter Cariad eine zentrale Fusionsarchitektur anstrebt.
