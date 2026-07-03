---
title: "BYD: Zentrale Sensor‑Architektur senkt Latenz um 20 %"
date: 2026-07-03T10:42:01.083Z
description: "BYD setzt auf eine zentralisierte Sensor‑Architektur: Rohdaten von Radar, Lidar und Kamera werden direkt an einen leistungsstarken ADAS‑SoC gesendet. Nach Herstellerangaben sinkt die Verarbeitungslatenz um rund 20 %, die Punktdichte steigt um das Zehnfache – ein Paradigmenwechsel für die Industrie."
source: "OFweek NEV"

category: "news"


tags: ["Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD: Zentrale Sensor‑Architektur senkt Latenz um 20 %

Die chinesische Automobilindustrie vollzieht einen grundlegenden Wandel in der Sensor‑Architektur: Weg von dezentralen Einheiten, in denen jeder Sensor seine eigenen Algorithmen ausführt, hin zu einer zentralisierten Architektur. Dabei werden die Rohdaten aller Sensoren – Radar, Lidar, Kamera, Ultraschall – über Hochgeschwindigkeitsverbindungen direkt an einen leistungsstarken ADAS‑SoC gesendet, der die gesamte Sensorfusion in einer einheitlichen Pipeline durchführt.

## Was bedeutet „zentralisierte Sensor‑Architektur“?

Bisher arbeitete jeder Sensor weitgehend autonom: Ein Radarsensor führte selbstständig FFT, Zielerkennung und Doppler‑Schätzung durch und lieferte lediglich eine komprimierte Zielliste („50 m voraus ein Hindernis“). Diese Vorverarbeitung ging mit Informationsverlust einher. In der neuen Architektur sendet der Sensor nur die rohen I/Q‑Daten (oder bei Lidar die Punktwolke) an den Zentralcomputer. Erst dort wird die gesamte Signalverarbeitung und Fusion durchgeführt.

Der Vorteil: Treffen Widersprüche aufeinander – etwa ein Radarsensor, der kein Hindernis meldet, während ein Lidar einen entfernten Punkt erfasst –, kann der zentrale Algorithmus die Stärken jedes Sensors kombinieren. „1 + 1 kann dann 5 ergeben“, beschreiben Entwickler den Effekt. BYD (比亚迪) setzt diese Architektur in mehreren Modellen um und erzielt laut eigenen Angaben eine Reduktion der Verarbeitungslatenz um rund 20 % sowie eine zehnfache Steigerung der Punktdichte in der Umgebungswahrnehmung.

## Warum der Umbruch jetzt – und wer verliert die Kontrolle?

Jahrzehntelang lag das Know‑how der Radarsignalverarbeitung bei den westlichen Tier‑1‑Zulieferern. Sie bestimmten, wie Ziele extrahiert, Störungen unterdrückt und Geschwindigkeiten geschätzt wurden. Die chinesischen OEMs bekamen nur die fertige, geschönte Zielliste – eine Blackbox, deren Innereien sie nicht verändern konnten.

Erst die Einführung von speziellen Bridge‑Chips (z. B. NXPs Radar Bridge) und offenen Rohdaten‑Schnittstellen ermöglicht den chinesischen Herstellern, die Signalverarbeitung selbst in die Hand zu nehmen. Die MMIC (Monolithische Mikrowellen‑ICs) plus ADC liefern nun die rohen FFT‑Spektren an den ADAS‑SoC. Gleichzeitig integrieren Chipanbieter wie NXP dedizierte Radar‑Signal‑Processing‑IP (RSP IP) direkt in den SoC, sodass OEMs eigene Algorithmen auf Standardhardware laufen lassen können.

Für L3- und L4‑Systeme reichen komprimierte Ziellisten nicht mehr aus. Gefordert werden rohe Entfernungs‑, Doppler‑ und Winkeldaten, um auch schwache Ziele wie Fußgänger oder liegende Gegenstände zu erkennen. Die zentralisierte Architektur ist damit eine Voraussetzung für höhere Automatisierungsstufen.

## Drei Sensortypen – drei Herausforderungen

**Millimeterwellenradar (MMW‑Radar):** Hier geht der Trend zu 4D‑Radaren mit Mehrfach‑MMIC. Chinesische Hersteller setzen auf einen günstigen 8T8R‑Pfad (1 SoC + 2 MMIC), Europa dagegen auf 16T16R oder sogar 24T24R. Bis 2028 werden sich die beiden Wege kostenseitig angleichen. Die eigentliche Hürde bleibt die Algorithmus‑IP und deren Integration in den SoC.

**Lidar:** Die zentralisierte Architektur verlagert die aufwendige FPGA‑Verarbeitung in den Zentralcomputer. Damit sinken die Kosten des Lidar‑Sensors, da nur noch optische Sender‑/Empfänger‑Komponenten plus SPAD‑Array benötigt werden. Allerdings steigt die Datenrate: Eine 192‑Linien‑Lidar‑Punktwolke mit 10 Hz und 0,1 Grad Auflösung erzeugt rund 3,6 Gbps. Das erfordert leistungsfähige Schnittstellen (GMSL2) und spezielle DSP‑Optimierungen, da Punktwolken anders als Kamerabilder strukturiert sind.

**Ultraschallsensor:** Hier ist die Umstellung am einfachsten, da die Algorithmen auf Laufzeitmessung basieren. BYD gibt für das Ultraschall‑System eine Latenzreduktion von rund 20 % und eine Zehnfach‑Steigerung der Punktdichte an – durch feinere Matched‑Filter‑Algorithmen im Zentralrechner. Die Herausforderung liegt in der Verdrahtung: 12 Sensoren bedeuten 12 SerDes‑Leitungen. BYD nutzt daher eine Hybridlösung – sechs Sensoren sammeln lokal und übertragen gebündelt an den Zentralcomputer.

## Fazit

Die chinesische Automobilindustrie baut eine vollständig zentralisierte Datenpipeline auf – vom rohen Sensorsignal bis zur Entscheidung, ohne Blackbox. „Die Daten fließen, die Algorithmen entscheiden“, so ein BYD‑Entwickler. Damit schaffen sie die Grundlage für den nächsten Schritt: von L2+ zu L3 und höher.

---

Für den europäischen Markt bedeutet diese Entwicklung, dass künftige Fahrzeuge chinesischer Hersteller potenziell von der verbesserten Sensorfusion profitieren könnten – sobald entsprechende Modelle in Europa zugelassen sind.
