---
title: "BYD: Zentralrechner verarbeitet 3,6 Gbit/s Lidar-Rohdaten"
date: 2026-07-06T13:43:00.202Z
description: "Chinesische Hersteller wie BYD setzen auf zentrale Sensorfusion. Statt gefilterter Signale fließen rohe Sensorströme mit bis zu 3,6 Gbit/s in einen SoC – Tier-1-Zulieferer verlieren die Kontrolle über die Algorithmen."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD: Zentralrechner verarbeitet 3,6 Gbit/s Lidar-Rohdaten

Chinesische Automobilhersteller wie BYD (比亚迪) vollziehen einen grundlegenden Architekturwechsel bei Fahrassistenzsystemen. Statt verteilter Sensoren mit eigener Vorverarbeitung setzen sie auf eine zentrale Sensorfusion: Rohe, ungefilterte Datenströme von Radar, Lidar und Kamera werden über Hochgeschwindigkeitsverbindungen (SerDes, GMSL) an einen leistungsstarken ADAS-SoC (System-on-a-Chip) gesendet. Dieser führt die gesamte Signalverarbeitung – von der FFT bis zur Objekterkennung – auf einem einzigen Chip durch. Damit entziehen die Hersteller den Tier-1-Zulieferern die Kontrolle über die Algorithmen und gewinnen die Hoheit über die Fahrassistenz zurück. Ein 192-zeiliges Lidar erzeugt dabei bereits bis zu 3,6 Gbit/s Rohdaten pro Frame – eine Datenmenge, die bisher nur gefiltert übertragen wurde.

## Von verteilter zu zentraler Architektur

Bisher arbeiteten Sensoren wie Millimeterwellenradar, Lidar und Ultraschallsensor weitgehend autonom: Jeder Sensor misst, filtert und meldet lediglich „Objekt erkannt" an das Steuergerät. Dabei gehen wertvolle Rohdaten verloren – etwa Phaseninformationen oder Frequenzspektren, die für eine präzise Umfelderkennung unerlässlich sind. Das führte zu widersprüchlichen Meldungen: „Millimeterwellenradar meldet Hindernis, Lidar sieht keines" – ohne die Möglichkeit, die Daten zu fusionieren.

Die neue Architektur kehrt dieses Prinzip um: Statt verarbeiteter Zielobjekte werden die unbearbeiteten Rohdatenströme an eine zentrale Recheneinheit gesendet. Diese führt die komplette Signalverarbeitung auf einem Chip durch und ermöglicht eine echte Sensorfusion. So können sich Lidar- und Radardaten gegenseitig ergänzen und korrigieren. Ein Beispiel: Bei Regen wird Lidar durch Wassertropfen gestört, während Millimeterwellenradar unempfindlich ist. In der zentralen Architektur kann der Algorithmus die Stärken beider Sensoren kombinieren – 1+1 ergibt potenziell mehr als 2.

## Machtverschiebung: Algorithmus statt Blackbox

Der entscheidende Hebel: Bisher besaßen Tier-1-Zulieferer das Know-how zur Radarsignalverarbeitung. Sie lieferten eine fertige Blackbox – der Hersteller bekam nur das Ergebnis, nicht die Rohdaten. Mit der zentralen Architektur verlagert sich diese Kompetenz in den ADAS-SoC. Chipentwickler wie NXP bieten spezielle Radar-Bridge-Chips an, die die Rohsignale direkt an den SoC weiterleiten. Auch Texas Instruments‘ AWR-Millimeterwellenradar-Chips unterstützen inzwischen RAW-Datenausgabe. Die Konsequenz: Automobilhersteller und ihre Chip-Partner erhalten die volle Kontrolle über Algorithmen, können Sensordaten optimal fusionieren und sogar nachträglich per OTA-Updates verbessern. Der Markt für Fahrassistenzsysteme wandelt sich vom Hardware-Lieferanten zum Software-Wettbewerb.

## Drei Sensortypen – drei Herausforderungen

**Millimeterwellenradar**: Der Trend geht zu 4D-Radaren mit mehreren Chips. China setzt auf günstige 8T8R-Lösungen (ein SoC + zwei MMICs), Europa auf 12- bis 16-Kanal-Systeme (16T16R), bis 2028 sind 24T24R geplant. Die eigentliche Hürde liegt im Algorithmus: Wer beherrscht die Radar-Signalverarbeitungs-IP? Kann sie auf die zentrale Plattform portiert werden? Und wie effizient verarbeitet der SoC die radarspezifischen Datenstrukturen (z. B. 2D-Range-Doppler-Matrizen) über MIPI-Schnittstellen, die eigentlich für Kamerabilder optimiert sind? NXP und andere arbeiten daran, diese IP direkt in den SoC zu integrieren.

**Lidar**: Die zentrale Architektur kann die Kosten senken, da der teure FPGA oder DSP im Lidar-Sensor selbst entfällt. Stattdessen werden nur noch rohe SPAD-Lichtlaufzeitdaten über MIPI an den SoC übertragen. Bei einem 192-zeiligen Lidar mit 10 Hz Bildrate, 120° horizontalem Sichtfeld und 0,1° Auflösung entstehen jedoch 3,6 Gbit/s Rohdaten pro Frame – eine enorme Herausforderung für die Datenübertragung (GMSL2 mit 6 Gbit/s reicht knapp) und die SoC-Verarbeitung. Zudem unterscheidet sich die Datenstruktur grundlegend von Kamerabildern: Lidar-Daten sind nach Slots organisiert, nicht nach Pixeln. Das erfordert angepasste DSP-Pipelines.

**Ultraschallsensor**: Hier ist die Signalverarbeitung vergleichsweise einfach – Laufzeitmessung, kein komplexes Radar-Spektrum. In der zentralen Architektur werden die Rohdaten aller zwölf Sensoren (jeweils mit SerDes-Leitung) vereinheitlicht. BYD berichtet von einem realen Test: Zeitverzögerung um 20 % reduziert, Erkennungsreichweite um 20 % gesteigert, Punktdichte um 10 % erhöht. Das System wählt automatisch zwischen vollständiger Zentralisierung und einer verteilten Vorverarbeitung mit Zwischenspeicherung – ein Kompromiss zwischen Datenmenge und Latenz.

## Fazit: Die Macht liegt nun in den Rohdaten

Chinesische Automobilhersteller bauen eine neue Datenpipeline auf, die vom Sensor bis zur Entscheidung ohne Blackbox auskommt. Nur mit den rohen Signalen können Algorithmen ihr volles Potenzial entfalten – und nur so lassen sich die Lücken in der aktuellen Fahrassistenz schließen. Nach der Hardware-Hoheit sichert sich die Industrie nun auch die Software-Hoheit. Der nächste Schritt: Von L2+ zu L3 und darüber hinaus – mit voller Kontrolle über die Wahrnehmung.

*Hinweis: Preise beziehen sich auf den chinesischen Markt und können in Europa abweichen.*

---

Die beschriebene Technologieentwicklung ist ein globaler Branchentrend. Chinesische Hersteller wie BYD, aber auch internationale Chipfirmen wie NXP und Texas Instruments treiben sie voran. Eine direkte Übertragbarkeit auf in Deutschland erhältliche Modelle ist gegeben, sobald diese die neue Architektur implementieren. Dies wird voraussichtlich ab 2025/2026 in neuen Fahrzeuggenerationen sichtbar.
