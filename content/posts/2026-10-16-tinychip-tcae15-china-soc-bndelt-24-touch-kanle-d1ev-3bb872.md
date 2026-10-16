---
title: "Tinychip TCAE15: China-SoC bündelt 24 Touch-Kanäle"
date: 2026-10-16T16:03:53.060Z
description: "Tinychip (泰矽微) startet den TCAE15: ein integrierter Touch-Sensor-SoC für Cockpit-Oberflächen mit bis zu 24 Kanälen, der Bauteile und Kosten spart."
source: "D1EV"

category: "news"

brands: ["Tinychip"]
tags: []
draft: false
original_url: "https://www.d1ev.com/news/shichang/313691"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# Tinychip TCAE15: China-SoC bündelt 24 Touch-Kanäle

China baut seine Kompetenz bei Automotive-Halbleitern weiter aus: Mit der TCAE15-Serie hat der chinesische Spezial-SoC-Hersteller Tinychip (泰矽微) einen neuen fahrzeugtauglichen Touch-Sensor-Controller vorgestellt. Der Mixed-Signal-Chip bündelt Stromversorgung, kapazitive Touch-Erkennung, Kommunikation und Sensor-Ansteuerung in einem einzigen Baustein und zielt auf intelligente Oberflächen im Fahrzeuginnenraum. Preise nennt der Hersteller nicht (B2B-Bauteil).

## Ein Chip statt drei Bausteine

Bislang greifen Hersteller zu diskreten Lösungen aus Touch-Mikrocontroller, externem LIN-Transceiver und Spannungsregler (LDO). Diese Kombination belegt viel Leiterplattenfläche, benötigt zahlreiche Bauteile und ist bei EMV- sowie Feuchtigkeitstests aufwendig abzustimmen. Der TCAE15 integriert Stromversorgung, Touch-Erkennung, Kommunikation, Signalaufnahme, Sensor-Ansteuerung und einen Hardware-Wasserschutz auf einem einzigen Chip. Nach Herstellerangaben sinken dadurch Bauteilkosten und Entwicklungsaufwand.

## Das steckt in der TCAE15-Serie

Technische Daten (je nach Variante):

- ARM Cortex-M0, 48 MHz, zusätzlich 32,768-kHz-Niederfrequenztakt
- 64 KB oder 128 KB Flash mit ECC-Prüfung, 16 KB SRAM
- Betriebsspannung 5,5 bis 18 V, Load-Dump-Festigkeit bis 40 V
- 50-mA-LDO, umschaltbar auf 3,3 V oder 5 V, plus 1,2-V-/10-mA-Referenz
- LIN-Transceiver und Data-Link-Layer nach ISO 17987 und J2602, LIN-Auto-Adressierung, Master-Slave-Bridge
- Kapazitive Touch-Erkennung mit bis zu 24 Kanälen
- Programmierbare Konstantstromquelle von 0,5 µA bis 125 µA für Widerstands- und PN-Übergangstemperaturmessung
- 16 ADC-Eingänge, auch differentiell
- Integrierter PGA mit achtstufiger Verstärkung (1x bis 16x)
- Zwölf 16-Bit-PWM-Ausgänge, ein Universal-Timer, drei 16-Bit-Basis-Timer
- SPI × 1, I2C × 1, UART × 2, QSPI für externen Speicher
- IO-Logikpegel wahlweise 3,3 V oder 5 V
- Elektrische Prüfung nach ISO 7637 und ISO 16750
- Gehäuse QFN32, QFN48 und QFN20, AEC-Q100 Grade 1, Sperrschichttemperatur −40 °C bis 150 °C

## Sechs Argumente für den SoC

Tinychip nennt vor allem sechs Vorteile:

- **Speicher:** 64 KB oder 128 KB Flash mit ECC sowie 16 KB ECC-SRAM reichen für aufwendige Touch-Algorithmen und parallele Peripherie-Aufgaben. Die 128-KB-Variante ist als zwei getrennte Flash-Einheiten ausgelegt und erlaubt ein A/B-Backup-OTA, das Firmware-Updates absichert.
- **Touch-Kanäle:** QFN48 unterstützt bis zu 24, QFN32 bis zu 17, QFN20 bis zu 8 Touch-Kanäle — passend für Tasten, Slider, Schalter und Dachbedieneinheiten.
- **Messtechnik:** Die programmierbare Stromquelle erlaubt zusammen mit dem PGA hochgenaue Widerstandsmessung über einen weiten Bereich und ermöglicht eine Doppelmessung mit der kapazitiven Erkennung. Zusätzlich lässt sich damit die Temperatur über den PN-Übergang messen — als Ersatz für Thermistoren.
- **Störfestigkeit:** Die ladungsausgeglichene Erfassungsarchitektur verbessert die EMV-Eigenschaften. Eine integrierte Hardware-Maskierung reduziert Fehlauslösungen bei Regen oder Kondenswasser.
- **Stromverbrauch:** Software- und Hardware-Sampling lassen sich kombinieren; dank der patentierten Tinywork®-Hardware-Verknüpfung erledigt der Chip die Touch-Erkennung im Niedriglastbetrieb eigenständig, ohne die CPU zu belasten.
- **Integration:** Ein einzelner Chip deckt Touch-Erkennung, LIN-Kommunikation und Stromversorgung ab — ohne Zusatzbausteine. Das senkt die Stücklisten- und Materialkosten, vereinfacht die Schaltungsentwicklung und verkürzt die Zeit bis zur Serienreife.

## Typische Einsatzbereiche

Der TCAE15 ist für berührungsempfindliche Oberflächen im Fahrzeug gedacht: Touch-Panels im Cockpit, berührungsempfindliche Schalter, die Sitzdruckerkennung, Fensterheber mit Einklemmschutz sowie Dach-Bedieneinheiten. Daneben passt er auf andere entfernte intelligente LIN-Knoten im Fahrzeug.

## Entwicklung und Support

Für eine schnelle Bewertung liefert Tinychip ein komplettes EVK-Evaluierungsboard, ein SDK, ein PC-Tool zum Abstimmen der Touch-Parameter sowie Referenzschaltpläne mit. Damit richtet sich das Angebot wie üblich an Zulieferer und Tier-1-Hersteller, die entsprechende Komponenten in ihre Plattformen integrieren.

---

## In Deutschland

Der TCAE15 ist ein Automotive-SoC, kein Fahrzeugmodell; eine Verfügbarkeit außerhalb Chinas oder ein Marktstart in Europa wurde nicht angekündigt. Für deutsche Hersteller und Zulieferer ist der Chip insofern relevant, als er als integrierte Alternative zu diskreten Touch-Lösungen etablierter europäischer und japanischer Halbleiteranbieter antritt.
