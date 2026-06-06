---
title: "[QA FAILED] Zentrale Sensor-Architektur: Chinesische Autoindustrie auf dem Vormarsch"
date: 2026-06-06T19:08:48.458Z
description: "Chinesische Hersteller ersetzen verteilte Sensorik durch zentrale Recheneinheiten. Das verspricht bessere KI-Fusion – und verlagert die Macht von Zulieferern zu Automobilherstellern."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 5
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Zentrale Sensor-Architektur: Chinesische Autoindustrie auf dem Vormarsch

Die chinesische Automobilindustrie treibt einen grundlegenden Wandel der Sensorarchitektur voran. Statt jedes Radar- oder Lidar-Modul mit eigener Rechenleistung auszustatten, gehen immer mehr Hersteller dazu über, die Rohdaten aller Sensoren in einer zentralen Einheit zu verarbeiten. Diese sogenannte „zentrale Fusionsarchitektur" verspricht eine deutlich präzisere Umfelderkennung – und verändert die Machtverhältnisse zwischen Autoherstellern und Tier-1-Zulieferern.

## Von verteilter zu zentraler Datenverarbeitung

Bisher arbeiteten Millimeterwellen-Radare, Lidar und Kameras weitgehend autark: Jeder Sensor analysierte seine Daten selbstständig und meldete dem Steuergerät lediglich eine Liste erkannter Objekte. Ein Millimeterwellen-Radar (kurz: Radar) meldete etwa „Hindernis 50 Meter voraus", eine Kamera „Fußgänger 30 Meter rechts". Die zentrale Einheit erhielt also bereits gefilterte Ergebnisse – und verlor dabei wertvolle Rohinformationen.

Die neue Architektur dreht den Spieß um: Statt lokaler Vorverarbeitung werden die ungefilterten Rohdaten jedes Sensors über Hochgeschwindigkeits-Leitungen (SerDes, serielle Schnittstellen) direkt zum zentralen ADAS-SoC (System-on-a-Chip) übertragen. Dort laufen alle Daten zusammen – Millimeterwellen-Radar, Lidar (Laser-Entfernungsmesser) und optische Kameras – und werden von einer einzigen KI-basierten Fusionsalgorithmik verarbeitet.

Der Vorteil: 1 + 1 kann mehr als 2 ergeben. So kann ein Millimeterwellen-Radar durch Regentropfen gestreute Signale liefern, während gleichzeitig ein Lidar durch seine schmale Wellenlänge klarere Bilder zeichnet. Die zentrale Einheit kann beide Rohdaten kombinieren, Kontraste verstärken und ein viel detaillierteres 3D-Umfeldmodell erstellen als jedes Einzelsystem allein.

## Machtverschiebung: Algorithmus-Know-how wandert vom Zulieferer zum Hersteller

Bislang lag das algorithmische Know-how für die Radarsignalverarbeitung tief in den Produkten der Tier-1-Zulieferer vergraben – etwa bei Bosch, Continental oder chinesischen Anbietern wie Huawei. Der Hersteller bekam nur eine „Blackbox": Er wusste, dass vorne ein Hindernis ist, aber nicht, wie der Algorithmus zu diesem Ergebnis kam.

Mit der zentralen Architektur ändert sich das. Der Zulieferer liefert nur noch die Hardware: eine sogenannte MMIC (Monolithic Microwave Integrated Circuit) für den Sende-/Empfangsbaustein, einen ADC (Analog-Digital-Wandler) und eine rudimentäre 1D-FFT (Fast Fourier Transform) – den ersten Rohschritt der Radarsignalverarbeitung. Die gesamte restliche Datenaufbereitung, Zielerkennung und Fusion übernimmt der ADAS-SoC des Herstellers selbst.

Das hat weitreichende Folgen: Die Zulieferer verlieren ihre Algorithmus-Hoheit. Wer die Rohdaten bekommt, entscheidet, wer die Wertschöpfung kontrolliert. Hersteller wie NIO, XPeng oder BYD können damit eigene, optimierte Algorithmen entwickeln – und sich von Zulieferern unabhängig machen.

## Technische Hürden: Rohdaten benötigen schnelle Schnittstellen und viel Rechenleistung

Der Umstieg auf Rohdaten ist technisch anspruchsvoll. Ein modernes Millimeterwellen-Radar mit 4D-Fähigkeit (Reichweite, Geschwindigkeit, Winkel, Höhe) produziert Datenraten von mehreren Gigabit pro Sekunde. Ein 192-Linien-Lidar erzeugt selbst bei 10 Hz Bildwiederholrate und 120° horizontalem Sichtfeld rund 3,6 Gbit/s Rohdaten. Die Verbindung zwischen Sensor und SoC muss über GMSL2 (Gigabit Multimedia Serial Link, 6 Gbit/s) oder ähnliche Hochgeschwindigkeitsbusse erfolgen.

Hinzu kommt, dass die Datenstruktur von Radaren und Lidaren grundlegend anders ist als die von Kameras. Kameras liefern einzelne Bildframes – für ISP (Image Signal Processor) optimiert. Radare liefern Frequenzspektren (Range-Doppler-Maps), Lidare liefern Slot-basierte Punktwolken (0,1°-Auflösung, 1200 Slots pro Frame). Die herkömmliche MIPI-Schnittstelle (Mobile Industry Processor Interface) ist für Kameradaten ausgelegt; Radar- und Lidar-Rohdaten müssen anders organisiert werden. Das erfordert spezielle DSP-Instruktionen auf dem SoC – sonst muss die CPU oder GPU die Daten mit deutlich niedrigerer Effizienz verarbeiten.

## Drei Sensorfamilien – unterschiedliche Herausforderungen

- **Millimeterwellen-Radar:** Derzeit gibt es zwei Entwicklungslinien: Eine chinesische „Cost-Effective"-Route mit 1 SoC + 2 MMIC (8T8R), und eine europäische Route mit 1 SoC + 4 MMIC (16T16R) – ab 2028 sind 24T24R geplant. Die Herausforderung liegt weniger in der Hardware als in der Algorithmik: Wer besitzt die Radar-Signalverarbeitungs-IP? Kann der Hersteller sie effizient auf seinem SoC portieren?

- **Lidar (Laserscanner):** Bei Lidar ist die Einsparung am größten: Bisher entfiel ein hoher Kostenanteil auf das FPGA (Field Programmable Gate Array) zur lokalen Signalverarbeitung. Durch die Verlagerung in den SoC entfällt dieser Baustein – es bleiben nur Laserdiode, SPAD-Empfänger (Single-Photon Avalanche Diode) und TDC (Time-to-Digital-Converter). Allerdings ist die Datenorganisation sehr anders als bei Kameras: Lidar-Daten sind slot-basiert, nicht frame-basiert. Die Anpassung der MIPI-Interface und der DSP-Pipeline ist aufwendig.

- **Ultraschallsensor (Einparkhilfe):** Am einfachsten: Hier reicht eine einfache Laufzeitmessung. In der zentralen Architektur werden die Roh-Echo-Daten (statt gefilterter Distanzen) zum SoC gesendet. Durch feinere Korrelationsfilter lässt sich die Reichweite um etwa 20 % steigern, die Messdichte um das Zehnfache. Der Nachteil: Pro Sensor wird eine separate SerDes-Leitung benötigt – bei 12 Sensoren also 12 Leitungen. Eine praktikable Lösung ist eine „dezentral-sammelnde" Zwischenstufe: Ein Sensor-Cluster (z. B. 6 Sensoren in der vorderen Stoßstange) bündelt die Daten und sendet sie über eine gemeinsame Leitung.

## Fazit: China macht den Schritt – und nimmt die Kontrolle über die Wahrnehmung

Die chinesische Automobilindustrie ist dabei, die letzte Blackbox der Sensorik zu öffnen: den Rohdaten-Pfad vom Sensor bis zur Entscheidung. Hersteller wie BYD (比亚迪) haben bereits angekündigt, ab 2025 auf zentrale Architektur zu setzen – mit rund 20 % weniger Berechnungslatenz, 20 % mehr Reichweite und bis zu zehnfacher Messdichte. Das ebnet den Weg für höhere Autonomiestufen (L2+ bis L3).

Die Verlagerung der Algorithmus-Hoheit von Tier-1 auf die Hersteller ist ein tiefer Einschnitt. Künftig wird nicht mehr der Zulieferer über das Wahrnehmungs-Know-how verfügen, sondern der Automobilkonzern selbst. Das könnte die Wettbewerbsordnung in der globalen Automobilindustrie nachhaltig verändern.

---

Die beschriebene Technologie wird in China entwickelt und hat derzeit noch keinen direkten Bezug zu in Europa erhältlichen Modellen. Eine Markteinführung entsprechender Fahrzeuge mit dieser Architektur wurde bislang nicht angekündigt.
