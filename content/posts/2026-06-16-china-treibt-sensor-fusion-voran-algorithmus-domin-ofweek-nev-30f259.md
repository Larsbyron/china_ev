---
title: "China treibt Sensor-Fusion voran: Algorithmus-Dominanz wechselt"
date: 2026-06-16T20:42:52.101Z
description: "Statt jeder Sensor einzeln auszuwerten, bündeln chinesische Hersteller Rohdaten in einem Zentralrechner. BYD (比亚迪) und andere setzen auf „vorwärtsgerichtete Fusion' – das verschiebt die Macht von Tier-1 zu Autoherstellern."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# China treibt Sensor-Fusion voran: Algorithmus-Dominanz wechselt

Die chinesische Automobilindustrie treibt eine grundlegende Änderung in der Sensor-Architektur für Assistenzsysteme und autonomes Fahren voran. Bisher wertete jeder Radar- oder Lidar-Sensor seine Daten selbst aus (sogenannte „hintere Fusion") und schickte nur abstrahierte Zielobjekte an das Steuergerät. Der neue Ansatz, die „vorwärtsgerichtete Fusion", leitet dagegen die rohen Sensordaten an eine zentrale Recheneinheit (SoC) weiter, die dann alle Signale gemeinsam verarbeitet.

## Warum der Wechsel wichtig ist
Durch die zentrale Rohdatenverarbeitung können Algorithmen die Stärken verschiedener Sensortypen kombinieren. Ein Beispiel: Ein Millimeterwellenradar („Haobo-Radar") kann durch Regen sehen, ein bildgebendes Radar („Hilicht-Radar") hat dagegen eine höhere Auflösung. Bei der alten Architektur meldet ein Sensor „kein Hindernis", der andere „Hindernis erkannt" – ein Widerspruch. Bei der vorwärtsgerichteten Fusion liegen beide Rohsignale im gleichen Koordinatensystem, sodass die Algorithmen die Stärken beider Sensoren fusionieren können. Das Ergebnis kann besser sein als die Summe der Einzelleistungen (1+1 kann 5 ergeben).

Der eigentliche Kern der Veränderung ist die **Kontrolle über die Algorithmen**. Bisher lag die Signalverarbeitung der Radare bei den Tier-1-Zulieferern (wie Continental, Bosch oder chinesischen Äquivalenten). Sie lieferten eine Blackbox: Das Steuergerät bekam nur die gefilterte Zielinformation, nicht die Rohdaten. Mit der vorwärtsgerichteten Fusion bleiben die Rohdaten (etwa das FFT-Frequenzspektrum) erhalten und werden auf dem SoC des Fahrzeugs verarbeitet. Das gibt den Autoherstellern die Hoheit über die Wahrnehmungsalgorithmen.

## Technische Hürden und Chip-Architekturen
Die Umstellung ist nicht trivial. Chip-Hersteller wie NXP bieten mittlerweile spezielle Radar-Bridge-Chips an, die die Verbindung zwischen MMIC (Hochfrequenzchip) und SoC herstellen. Gleichzeitig integrieren immer mehr ADAS-SoCs spezielle Radar-Signalverarbeitungs-IP (RSP IP). Auch Texas Instruments (TI) unterstützt mit seinen AWR-Radar-Chips den Rohdaten-Modus.

Allerdings gibt es Unterschiede in den Systemanforderungen: Für L2-Assistenzsysteme reichen einfachere „hintere Fusions"-Ansätze, während für L3/L4 autonomes Fahren die hochauflösende Rohdaten-Fusion notwendig wird, um Objekte wie stehende Fahrzeuge, Schlaglöcher oder Steine von der Fahrbahn unterscheiden zu können.

Die chinesische Industrie fährt hier zweigleisig:
- **Preissensible Route**: 1 SoC + 2 MMICs (8T8R-Konfiguration) für hohe Kostenkontrolle
- **Performance-Route**: 1 SoC + 4 MMICs (16T16R), in Europa sogar 24T24R geplant

Bis 2028 werden sich beide Pfade weiterentwickeln.

## Herausforderungen bei Lidar und Ultraschall
Auch Lidar-Sensoren profitieren von der vorwärtsgerichteten Fusion. Bisher hatten Lidare einen eigenen FPGA zur Signalverarbeitung an Bord, der Kosten verursacht. Wenn die Verarbeitung in den Zentralrechner wandert, müssen nur noch die reinen optischen Komponenten (Laser, SPAD-Empfänger) plus TDC-Zeitmessung verbaut werden. Allerdings unterscheidet sich die Datenstruktur von Lidar-Punktwolken fundamental von Kamerabildern – MIPI-Schnittstellen und DSPs sind darauf nicht optimiert, was die Effizienz senkt.

Bei Ultraschallsensoren ist die vorwärtsgerichtete Fusion grundsätzlich einfach, da die Signalverarbeitung (Laufzeitmessung) wenig Rechenleistung braucht. Dennoch steigt durch die Übertragung aller Rohdaten die Datenlast auf den SerDes-Leitungen. BYD (比亚迪) hat einen „Zwischenansatz" vorgestellt: Teilweise lokale Vorverarbeitung plus zentrale Fusion, um die Verkabelung zu reduzieren. Das Ergebnis: Zeitgewinn von knapp 20 %, Erhöhung der Erkennungsreichweite um 20 % und eine Verdreifachung der Zielerkennungsdichte.

## Fazit
Die Kernbotschaft des Artikels: Chinesische Autohersteller wollen die **volle Kontrolle über die Datenpipeline** – vom rohen Sensorsignal bis zur endgültigen Entscheidung. Keine Blackbox mehr. Der Trend zur vorwärtsgerichteten Fusion ist langfristig der Weg zu besseren autonomen Fahrsystemen und verändert die Machtverhältnisse in der Lieferkette: Die Algorithmen-Dominanz wandert von den Tier-1-Zulieferern zu den Fahrzeugherstellern und ihren Chip-Partnern.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
