---
title: "BYD-Radar: 20 % mehr Sensor-Reichweite, zehnfache Dichte"
date: 2026-06-04T19:59:03.803Z
description: "BYD stellt eine entkoppelte Sensorarchitektur vor: Radare liefern Rohdaten an einen zentralen SoC statt Ziel-Listen. Ergebnis: 20 % weniger Latenz, 20 % mehr Sensor-Reichweite, zehnfache Dichte. Der Trend könnte bald Europa erreichen."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD-Radar: 20 % mehr Sensor-Reichweite, zehnfache Dichte

Die chinesische Autoindustrie treibt einen grundlegenden Wandel der Sensorarchitektur für Fahrassistenzsysteme voran. Statt wie bisher jede Radar-Einheit eigenständig signalverarbeiten zu lassen, setzt ein neuer Trend auf „entkoppelte“ Architekturen: Sensoren liefern rohe, unverarbeitete Daten (ADC-Rohdaten, FFT-Spektren) direkt an eine zentrale Recheneinheit (SoC). BYD (比亚迪) hat nun auf einer eigenen Technologieveranstaltung eine solche Architektur vorgestellt und konkrete Verbesserungen genannt – darunter 20 % geringere Latenz, 20 % größere Reichweite und eine zehnfach höhere Sensordichte. Konkrete absolute Vergleichswerte nannte der Hersteller nicht, die relativen Fortschritte sind jedoch für die Branche richtungsweisend.

## Von Ziel-Listen zu Rohdaten

Bisher arbeitete jedes Radar als geschlossene Blackbox: Signalaufnahme, FFT, Zielerkennung, Doppler – alles fand im Sensor statt. Ausgespuckt wurde nur eine Liste von Zielen („50 Meter voraus Hindernis“). Diese Verdichtung vernichtet wertvolle Information. Die neue Architektur hingegen leitet sämtliche Rohdaten über SerDes-Leitungen (z. B. GMSL) in das zentrale SoC. Dort kann die Software erstmals alle Korrelationen zwischen Radar-, Lidar- und Kamerasignalen nutzen – ein echter Informationsgewinn, der 1+1 nicht 2, sondern vielleicht 5 ergibt.

Ein Beispiel: Bei Regen wird das Lidar-Signal durch Wassertropfen gestreut, entfernte Ziele verschwimmen. Das Millimeterwellen-Radar hingegen durchdringt Regen problemlos. In der alten Architektur lieferten beide Sensoren widersprüchliche Ziel-Listen. In der neuen zentralen Fusion können Algorithmen die Stärken beider Sensoren kombinieren – etwa indem sie das Radarsignal zur Bestätigung unsicherer Lidar-Punkte nutzen.

## Algorithmen-Kontrolle wechselt vom Tier-1 zum OEM

Der Schlüssel liegt im Wandel der Wertschöpfungskette. Bisher hielten Tier-1-Zulieferer (wie Bosch oder Continental) das Know-how der Radarsignalverarbeitung in ihren Blackbox-Firmwares fest. Mit der neuen Architektur werden nur noch die reinen HF-Bausteine (MMIC, ADC) im Sensor belassen. Die gesamte digitale Verarbeitung – vom 1D-FFT bis zur Objektklassifikation – zieht in den ADAS-SoC des Herstellers.

Chiphersteller wie NXP treiben diesen Schritt mit speziellen Radar-Bridge-Chips und integrierten Radar-Signal-Prozessoren (RSP-IP) in den SoCs voran. Auch Texas Instruments (TI) unterstützt mit seinen AWR-Serien den RAW-Daten-Modus. So können OEMs künftig eigene Algorithmen auf dem SoC ausführen, ohne auf die Firmware der Zulieferer angewiesen zu sein. Für höhere Autonomiestufen (L3/L4) wird diese tiefe Sensorfusion immer wichtiger: Um beispielsweise ein verschmutztes, steiniges Hindernis von einem harmlosen Schild zu unterscheiden, braucht die KI die Rohdaten aller Sensoren.

## Technische Herausforderungen der drei Radar-Typen

Die Umstellung betrifft alle drei Radararten unterschiedlich.

**4D-Millimeterwellen-Radar (Imaging-Radar):** Hier zeichnen sich zwei Wege ab. Der chinesische, kosteneffiziente Pfad setzt auf 1 SoC + 2 MMIC für 8T8R-Antennen (6 × 8 Kanäle). Der europäische Pfad geht auf 1 SoC + 4 MMIC für 16T16R (bis zu 24T24R geplant). Bis 2028 werden beide Linien weiter existieren, mit unterschiedlichen Kosten- und Leistungsprofilen. Die größte Hürde ist jedoch nicht die Hardware, sondern die Algorithmus-Integration: Wer liefert die Radar-Signal-IP – Tier-1 oder Zulieferer? Wer portiert die Algorithmen auf den zentralen SoC? Und können die DSP-Kerne die Datenorganisation von Radar (3D/4D-Matrizen) genauso effizient verarbeiten wie die von Kameras (2D-Frames)?

**Lidar:** Hier ist die Entkopplung einfacher, da viele Lidare bereits auf FPGA-basierter Signalverarbeitung setzen. Doch die Kosten für die zentrale Rechenleistung steigen: Ein hochauflösendes 192-Zeilen-Lidar mit 10 Hz Bildrate, 120° horizontalem Sichtfeld und 0,1° Auflösung erzeugt etwa 3,6 Gbps Rohdaten. Das GMSL2-Interface reicht zwar (bis 6 Gbps), aber die Datenstruktur des Lidars (Slots mit Trägerwellen, keine Pixelraster) unterscheidet sich fundamental von Kamera-Daten. Die SoC-Architektur muss daher speziell angepasst werden.

**Ultraschallsensor:** Hier ist die Umstellung simpel: Statt im Sensor den Laufzeit-Algorithmus zu rechnen, werden die Rohechos zentral verarbeitet. BYD gibt für seine entkoppelte Ultraschall-Architektur konkrete Werte an: 20 % geringere Latenz, 20 % größere Reichweite und eine zehnfach höhere Sensordichte. Allerdings steigt der Verkabelungsaufwand: Typisch sind 12 Sensoren, jeder mit eigener SerDes-Leitung. BYD löst das durch eine „verteilte Erfassung + zentrale Fusion“, bei der die Sensoren in Gruppen vorgefiltert werden.

## Fazit: China treibt den Wandel – Europa folgt zögerlich

Die chinesische Autoindustrie schafft eine durchgängige Datenpipeline von den Rohsignalen bis zur Entscheidung – ohne Blackbox dazwischen. Diese Transparenz erlaubt tiefere Algorithmen und bessere Sensorfusion, was den Abstand zu etablierten Anbietern verringert. Europäische OEMs beobachten den Trend genau. Erste Projekte mit entkoppelten Architekturen laufen, doch das Tempo ist unterschiedlich. Ob und wann die Technik in deutschen Modellen Einzug hält, ist noch offen – der Wettbewerbsdruck aus China wächst jedoch.

---

Noch kein Serieneinsatz in Deutschland, aber der Trend wird von deutschen Zulieferern und OEMs intensiv beobachtet. Erste Pilotprojekte für entkoppelte Radar-Architekturen sind in der Entwicklung, ein Marktstart in Europa könnte ab 2026/2027 erfolgen.
