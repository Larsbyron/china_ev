---
title: "BYD rüstet um: 20 % weniger Latenz durch neue Sensor-Rohdaten"
date: 2026-06-17T13:40:14.050Z
description: "BYD setzt auf eine zentrale Sensor-Architektur, die rohe Sensordaten direkt verarbeitet. Die Folge: 20 % niedrigere Latenz und deutlich präzisere Umfelderkennung. Ein neuer Branchentrend?"
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD rüstet um: 20 % weniger Latenz durch neue Sensor-Rohdaten

Die chinesische Automobilindustrie erlebt einen grundlegenden Wandel bei der Architektur von Fahrassistenzsystemen (ADAS). Bisher arbeiteten Sensoren wie Radar, Lidar oder Kameras als eigenständige „Blackboxen": Sie verarbeiteten die Signale intern und lieferten nur gefilterte Ergebnisse an das zentrale Steuergerät. Ein Radarsensor meldete etwa „50 Meter voraus: Hindernis", ein anderer „30 Meter rechts: Fußgänger". Diese Abstraktion führt zu Informationsverlust – gerade dann, wenn sich widersprüchliche Meldungen gegenüberstehen, etwa bei Regen.

Die Lösung heißt zentrale Rohdaten-Architektur. Statt vorverarbeiteter Zielobjekte fließen nun die reinen Signale (z. B. Frequenzspektren oder I/Q-Daten) direkt in einen leistungsstarken zentralen SoC (System-on-a-Chip). Dort übernimmt die Algorithmik die gesamte Signalverarbeitung, Sensorfusion und Umfeldinterpretation. Das ermöglicht eine deutlich robustere Entscheidungsfindung: Radar- und Kameradaten lassen sich auf einer gemeinsamen Basis abgleichen, Fehlinterpretationen (z. B. Regentropfen als Hindernis) werden vermieden.

## Vom Tier-1 zum OEM: Kontrollwechsel

Der Schlüssel liegt in der Kontrolle über die Algorithmen. Bislang hielten Tier-1-Zulieferer wie Bosch oder Continental das Know-how für Radarsignalverarbeitung (FFT, CFAR, Doppler-Schätzung) in ihrer firmeneigenen Firmware. Die neue Architektur zwingt die Zulieferer, ihre „Blackbox" zu öffnen: Sie liefern nur noch die rohen Chip-Daten (MMIC + ADC), während die eigentliche Signalverarbeitung auf den SoC des Fahrzeugherstellers verlagert wird. Halbleiterfirmen wie NXP und Texas Instruments unterstützen diesen Trend mit speziellen Bridge-Chips und Radar-Signalverarbeitungs-IP, die direkt in ADAS-SoCs integriert werden.

Herausforderungen bleiben: Die Datenraten steigen enorm – ein 192-Linien-Lidar erzeugt bis zu 3,6 Gbit/s Rohdaten. Zudem unterscheidet sich die Datenstruktur von Lidar und Radar grundlegend von der eines Kamerabilds, was die Effizienz der DSPs (digitale Signalprozessoren) auf dem SoC beeinträchtigen kann. Dennoch gehen alle großen Hersteller diesen Weg.

## BYD als Vorreiter: Konkrete Verbesserungen

BYD (比亚迪) gehört zu den Vorreitern dieser Entwicklung. In seinem neuesten Fahrassistenzsystem setzt der Konzern auf eine „teils zentrale, teils verteilte" Architektur mit einem Zwischenlayer. Die Ergebnisse sind beeindruckend: Die Latenz sank um 20 %, die Erkennungsreichweite stieg um 20 % und die Punktwolkendichte verbesserte sich um das Zehnfache. Damit werden nicht nur Hindernisse präziser erfasst, sondern auch feine Unterschiede – etwa zwischen einer nassen Fahrbahn und einem festen Objekt – zuverlässig unterschieden.

Dieser Architekturwechsel markiert einen Machtwechsel in der Zuliefererkette: Die Algorithmus-Hoheit wandert von den Tier-1-Zulieferern zu den Fahrzeugherstellern. Für die nächste Stufe des autonomen Fahrens (L3 und darüber) ist dies eine essenzielle Voraussetzung – und ein klares Zeichen, dass Chinas Autoindustrie technologisch Eigenständigkeit anstrebt.

---

Es handelt sich um eine branchenweite Technologieentwicklung, die noch keinem konkreten Fahrzeugmodell für den deutschen Markt zugeordnet ist.
