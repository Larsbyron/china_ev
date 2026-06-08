---
title: "[EDITORIAL REJECTED] BYD: 10x Punktdichte, 20 % weniger Latenz — Domain-Controller"
date: 2026-06-08T20:07:10.666Z
description: "Chinesische Autobauer entziehen Tier-1-Zulieferern die Kontrolle über Sensor-Algorithmen. Der Trend zur zentralen Rechnerarchitektur verspricht flexiblere Software – und weniger Blackboxen."
source: "OFweek NEV"

category: "news"

brands: ["(leer)"]
tags: ["Reichweite", "Autonomes Fahren"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [EDITORIAL REJECTED] BYD: 10x Punktdichte, 20 % weniger Latenz — Domain-Controller

Die chinesische Automobilindustrie vollzieht einen grundlegenden Wandel in der Fahrassistenz-Architektur: Statt dezentraler Steuergeräte kommt eine zentrale Rechnerarchitektur zum Einsatz – die Domain-Controller-Architektur. Alle Sensordaten (Radar, Lidar, Kamera) werden als Rohdaten über Hochgeschwindigkeitsverbindungen (SerDes/GMSL) an ein leistungsstarkes System-on-Chip (SoC) gesendet. Dort erfolgt die sensorübergreifende Fusion und Objekterkennung. Dieser Paradigmenwechsel verschiebt die Machtverhältnisse in der Lieferkette grundlegend.

## Was ist eine Domain-Controller-Architektur?

Bisher verarbeiteten Sensoren ihre Daten lokal. Ein Millimeterwellenradar führte selbst FFT (Fast Fourier Transform), Zielerkennung und Geschwindigkeitsmessung durch und sendete nur das verdichtete Ergebnis – etwa „50 Meter voraus Hindernis“. Details gingen verloren. In der neuen Architektur liefern die Sensoren sämtliche Rohdaten – FFT-Spektrumplots, Radar-RAW-Bilder oder komplette Punktwolken – an den zentralen SoC. Erst dort werden Sensorfusion und Objekterkennung durchgeführt. Das ermöglicht intelligentere Kombinationen: Ein Lidar sieht durch Regenschleier schlecht, ein Radar hat bessere Reichweite, aber geringere Winkelauflösung – gemeinsam im Rohdatenraum ergeben 1 + 1 nicht 2, sondern 5.

## Warum erst jetzt? – Die Machtfrage bei Radar-Algorithmen

Bislang lag das Know-how für Radarsignalverarbeitung fest bei den Tier-1-Zulieferern. Sie steckten ihr Wissen – FFT-Zielextraktion, Entfernungs- und Geschwindigkeitsbestimmung – in die Firmware der Sensoren. Die OEMs bekamen nur die fertige Kost, ohne Einblick in die Zubereitung. Nun wollen chinesische Autohersteller das Ruder übernehmen. Sie verlangen von den Zulieferern, dass Sensoren nur noch die rohen analogen Signale (MMIC + ADC) und eine einfache 1D-FFT liefern – alles Weitere passiert auf dem zentralen SoC.

Ermöglicht wird dies durch leistungsstarke Chips: NXP (恩智浦) hat spezielle Radar-Bridge-Chips entwickelt, die MMIC und SerDes verbinden. Texas Instruments (德州仪器) bietet mit der AWR-Serie ebenfalls RAW-Daten-Unterstützung. Für L3/L4 autonomes Fahren reichen einfache Ziel-Listen nicht mehr aus – die Rohdaten sind notwendig, um etwa stehende Hindernisse oder auf der Straße liegende Gegenstände zuverlässig zu erkennen. Die SoC-Leistung ist heute ausreichend, um zwölf Radar-FFTs und CFAR in Echtzeit zu verarbeiten. Künftig werden Radar und Lidar lange koexistieren – entscheidend ist, wer die Algorithmen kontrolliert.

## Radarsensoren: Zwei Entwicklungslinien

Bei der Domain-Controller-Architektur profitieren Millimeterwellenradar, 4D-Radar und Kamera gleichermaßen. Im 4D-Radarbereich zeichnen sich zwei Wege ab: Die chinesische Kosteneffizienz-Route („1 SoC + 2 MMIC“ für 6–8 Sende-/8–10 Empfangskanäle, 8T8R) und die europäische Route („1 SoC + 4 MMIC“ für 12–16 Kanäle, bis 24T24R geplant). Bis 2028 werden sich diese Pfade je nach Kostenmodell und Anwendungsszenario differenzieren.

Die eigentliche Herausforderung liegt jedoch nicht in der Hardware, sondern in den Algorithmen und der Plattform-Integration:
* Wer besitzt die Radar-Algorithmus-IP? Verbleibt sie bei Tier-1 oder wandert sie zum OEM?
* Wer portiert und validiert die IP auf dem zentralen SoC – ein enormer Arbeitsaufwand.
* Passen die Datenformate (z. B. MIPI-Schnittstellen für Kameras vs. radarspezifische 2D/3D-Organisation) und DSP-Einheiten effizient zusammen?
* NXP (恩智浦) treibt die Integration von RSP-IP in den SoC voran, um die algorithmische Mauer der Tier-1 zu durchbrechen.

## Lidar: Rohdaten sparen Kosten

Lidar profitiert direkt von der Domain-Controller-Architektur: Die teure FPGA-Signalverarbeitung im Sensor entfällt; nur noch Sender, SPAD-Empfänger und TDC bleiben als Hardware übrig. Moderne Lidar-Sensoren liefern bereits SPAD-Rohdaten als Abstand-Direkt histogramme über MIPI. Die Datenstruktur eines 128-Linien-Lidars (10 Hz, 120° horizontal, 0,1° Auflösung) erzeugt etwa 3,6 Gbit/s – gut übertragbar via GMSL2 (6 Gbit/s). Allerdings unterscheidet sich die Datenorganisation fundamental von Kameras: Lidar-Daten sind slot-basiert (z. B. 1200 Slots pro Frame mit Abstand, Amplitude, Doppler-Information), nicht framebasiert wie Bilddaten. Das erfordert spezielle DSP-Verarbeitung auf dem SoC.

## Kamera: Einfachheit und doch Herausforderung

Kamera-Sensoren benötigen keine aufwändige Signalvorverarbeitung – die Rohdaten (Bayer-Pattern) werden einfach zum SoC übertragen. Bei der Domain-Controller-Architektur fallen allerdings 12 oder mehr Kameraleitungen an, jede mit eigenem SerDes – was hohe Kosten und Anschlusskomplexität bedeutet. Ein praktikabler Ansatz ist „lokal aggregieren + zentral rechnen“: Vorn und hinten sitzen jeweils sechs Kameras, deren Daten gebündelt auf den SoC gelangen. So bleiben die Vorteile der zentralen Verarbeitung erhalten, ohne dass ein Spinnennetz an Leitungen entsteht.

BYD (比亚迪) setzt genau diesen Mittelweg um – mit 20 % niedrigerer Latenz, 20 % größerer Reichweite und zehnfacher Punktdichte. Das Unternehmen balanciert zwischen „voll zentral“ und „voll verteilt“ mit einer intelligenten Zwischenebene.

## Fazit

Die chinesische Automobilindustrie baut eine Datenpipeline von den Sensoren bis zur Entscheidung – ohne Blackboxen. Nur wenn die Daten verfügbar sind, können Algorithmen ihr volles Potenzial entfalten und den Rückstand zu etablierten Herstellern aufholen. Nach den Kameras folgen Radar und Lidar – der nächste Schritt zu L2+ und L3 autonomem Fahren.

*Hinweis: Preise beziehen sich auf den chinesischen Markt und können in Europa abweichen.*

---

Der beschriebene Technologiewandel betrifft die gesamte Branche. Deutsche Hersteller wie BMW, Mercedes und Audi beobachten die Entwicklungen genau. Ein konkreter Marktstart für ein Modell ist nicht genannt.
