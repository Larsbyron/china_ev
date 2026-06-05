---
title: "Konzentrierte Sensorarchitektur: +20% Reichweite, 10x mehr Punktdichte"
date: 2026-06-05T11:31:08.936Z
description: "Chinesische Hersteller führen eine zentrale Sensorarchitektur ein. Rohdaten aller Sensoren werden in einem SoC fusioniert. Das bringt 20 % mehr Reichweite und eine zehnfach höhere Punktdichte – und entmachtet die Tier-1-Zulieferer."
source: "OFweek NEV"

category: "news"

brands: ["NXP", "Texas Instruments"]
tags: ["Sicherheit"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Konzentrierte Sensorarchitektur: +20% Reichweite, 10x mehr Punktdichte

Die chinesische Automobilindustrie treibt einen grundlegenden Wandel in der Sensorarchitektur voran. Weg von der dezentralen Verarbeitung, bei der jeder Sensor seine eigene „Blackbox" mit Algorithmen enthielt, hin zu einer zentralen Datenfusion. Das Ziel: Die vollständige Kontrolle über die Rohdaten und die Entscheidungsfindung zurückzugewinnen – und damit die Abhängigkeit von klassischen Tier-1-Lieferanten zu beenden.

## Von verteilt zu zentral: Die neue Architektur

Bisher arbeiten Radar, Lidar und Kameras weitgehend autark. Ein 4D-Radar signalisiert „Hindernis 50 Meter voraus", ein Bildsensor meldet „Fahrzeug 30 Meter links". Die übergeordnete Steuereinheit erhält bereits gefilterte, abstrahierte Objektlisten – wertvolle Rohinformationen gehen verloren.

Die zentrale Architektur dreht den Spieß um: Alle Sensoren liefern ihre Rohdaten über SerDes-Leitungen an ein einziges Hochleistungs-SoC (System-on-Chip). Dort werden sie in einem einheitlichen Koordinatensystem fusioniert. „Statt 'wer sagt was' heißt es jetzt 'was ist wirklich da'", beschreibt ein Entwickler den Paradigmenwechsel. Das Ergebnis: Statt 1+1=2 kann 1+1=5 werden – weil die Stärken eines Sensors die Schwächen eines anderen ausgleichen.

Beispiel: Ein Bildsensor „sieht" durch Regentropfen hindurch deutlich schlechter, während ein 4D-Radar fast unbeeinträchtigt bleibt. In der dezentralen Architektur entsteht ein Widerspruch („Radar: kein Hindernis, Kamera: Hindernis"). In der zentralen Architektur nutzt der Algorithmus die robuste Radarinformation, um die Kamera-Karte „aufzuladen" – die Gesamterkennung wird zuverlässiger.

## Warum jetzt? – Algorithmus-Kontrolle wechselt

Der entscheidende Treiber ist der Wechsel der Algorithmus-Hoheit. Bisher waren die Signalverarbeitungs-Know-hows – etwa wie FFT-Spektren ausgewertet oder Ziele getrackt werden – tief in der Firmware von Tier-1-Lieferanten verborgen. OEMs bekamen nur die fertigen Objektlisten, aber nie die Rohdaten zu sehen.

Jetzt fordern chinesische Hersteller den kompletten Zugriff. Sie wollen nur noch die reine Hardware: das Radar-MMIC (Hochfrequenz-Sendeempfänger), den ADC (Analog-Digital-Wandler) und gegebenenfalls einen einfachen 1D-FFT-Vorprozessor. Die gesamte weitere Signalverarbeitung zieht auf das zentrale ADAS-SoC um.

Chip-Hersteller wie NXP und Texas Instruments unterstützen diesen Trend. NXP bietet mit dem Radar Bridge einen dedizierten Bridge-Chip, der die Rohdaten vom MMIC über SerDes an das SoC weiterleitet. Parallel integrieren sie Radar-Signalverarbeitungs-IP (RSP IP) direkt in ihre ADAS-SoCs. Texas Instruments stellt mit der AWR-Serie Radarchips zur Verfügung, die RAW-Daten-Ausgabe unterstützen – essentielle Basis für die zentrale Architektur.

Die technische Herausforderung: L3/L4-Fahrfunktionen benötigen keine abstrakten Objektlisten mehr, sondern hochauflösende Punktwolken mit Mikro-Doppler-Informationen. Damit lassen sich bewegte Ziele wie Radfahrer von stehenden Objekten wie Gullydeckeln unterscheiden. Die Datenmenge steigt massiv – ein SoC muss zwölf Radar-Streams gleichzeitig mit FFT und CFAR (Constant False Alarm Rate) verarbeiten können.

## Drei Sensorklassen – drei Wege zur Fusion

Die zentrale Architektur betrifft Radar, Lidar und Ultraschall gleichermaßen, aber mit unterschiedlichen Konsequenzen.

**4D-Radar:** Bereits heute sind Multi-Chip-Architekturen mit einem SoC und zwei MMICs (8T8R) üblich. Chinesische Hersteller setzen auf eine kostengünstige 8T8R-Linie, europäische Anbieter planen 12T16R oder sogar 24T24R bis 2028. Die Herausforderung: Die Algorithmen-IP muss erst auf dem zentralen SoC portiert werden, und die MIPI-Schnittstelle ist für Kamera-Frames optimiert, nicht für die völlig anders organisierte Radar-Datenstruktur.

**Lidar:** Der Übergang ist hier am direktesten. Bisher entfiel ein erheblicher Kostenanteil auf die FPGA-basierte Signalverarbeitung im Sensor. Zukünftig übernimmt das zentrale SoC nur noch die Rohdaten von SPAD (Single-Photon Avalanche Diode) und TDC (Time-to-Digital-Converter). Allerdings: Ein 192-Zeilen-Lidar mit 10 Hz Bildrate und 0,1° Auflösung erzeugt rund 3,6 Gbps Rohdaten – das entspricht fast einem unkomprimierten Videostream. GMSL2 mit 6 Gbps reicht knapp, aber die Verarbeitung im SoC erfordert spezielle DSP-Kerne, die nicht für Kameras optimiert sind.

**Ultraschall:** Akustische Sensoren sind algorithmisch einfach (Laufzeitverfahren). In der zentralen Architektur steigt die CPU-Last um etwa 20 %, während die Punktdichte um das Zehnfache erhöht werden kann – durch feinere Korrelationsfilter. Praktisch realisieren viele Hersteller einen Kompromiss: Ein lokaler Vorprozessor im Stoßfänger bündelt die Signale von sechs Sensoren, bevor die Daten an das zentrale SoC gehen. BYD (比亚迪) nennt das „teilzentrale Architektur" – eine pragmatische Mischung aus zentraler Verarbeitung und lokaler Vorsortierung.

## Fazit: Der Datenpipe gehört den OEMs

Die chinesische Automobilindustrie verfolgt ein klares Ziel: Vom Rohsignal bis zur Entscheidung soll es keine Blackbox mehr geben. Nur wer die vollständige Datenpipeline kontrolliert, kann die Algorithmen optimieren, die letztlich über Sicherheit und Fahrerlebnis entscheiden. Nach den Kameras folgen nun Radar, Lidar und Ultraschall – der nächste Schritt auf dem Weg zum autonomen Fahren der Stufen 2+ und 3.

---

## In Europa
Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt. Der Artikel beschreibt eine technische Entwicklung der chinesischen Industrie.
