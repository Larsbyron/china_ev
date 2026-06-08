---
title: "Zentrale Sensorarchitektur: BYD holt Algorithmen-Kontrolle zu den OEMs"
date: 2026-06-08T06:35:24.747Z
description: "BYD setzt auf zentrale Rechenarchitektur: Rohdaten aller Radar-, Lidar- und Ultraschallsensoren werden direkt an ein zentrales SoC übertragen. Dies ermöglicht eine verbesserte Fusion und gibt den Herstellern die volle Kontrolle über die Signalverarbeitung."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# Zentrale Sensorarchitektur: BYD holt Algorithmen-Kontrolle zu den OEMs

Chinesische Autohersteller vollziehen einen grundlegenden Wandel in der Architektur ihrer Fahrassistenzsysteme. Statt auf verteilte, abgeschlossene Sensormodule („Blackbox“) zu setzen, rücken immer mehr Hersteller wie BYD (比亚迪) zu einer zentralen Rechenarchitektur. Dabei werden die Rohdaten aller Radar-, Lidar- und Ultraschallsensoren direkt – ohne Vorverarbeitung im Sensor – an eine zentrale System-on-Chip-Plattform (SoC) übertragen. Erst dort findet die komplette Sensorfusion, Objekterkennung und Entscheidungsfindung statt.

## Was ist die zentrale Sensorarchitektur?

Der Kerngedanke: Der Sensor wird auf reine Hardware reduziert – MMIC (Hochfrequenz-Baustein) und ADC (Analog-Digital-Wandler) – und führt nur eine erste eindimensionale FFT (Fast-Fourier-Transformation) durch. Alle weiteren Schritte – Zielklassifizierung, Dopplerauswertung, Clustering – verlagern sich auf das zentrale SoC. Bisher war jeder Sensor ein eigenständiger „Mini-Computer": Ein Millimeterwellenradar führte Signalaufnahme, FFT, Zielerkennung und Doppler-Auswertung komplett im Sensor durch und meldete nur das Ergebnis „Hindernis in 50 m". Die Rohdaten gingen verloren. Mit der neuen Architektur erhalten die OEMs die volle Kontrolle über die Algorithmen und können eigene, optimierte Lösungen einsetzen.

Vorteile der zentralen Architektur:
- **Rohdatenfusion statt gefilterter Einzelergebnisse:** Alle Sensoren liefern ihre Primärdaten in ein einheitliches Koordinatensystem. Beispiel: Ein Millimeterwellenradar wird durch Regen stark gestört, ein Lidar liefert klare Signale. In der alten Blackbox-Architektur käme ein widersprüchlicher Report („Radar sagt ja, Lidar sagt nein"). Bei der zentralen Fusion können Algorithmen die Stärken beider Sensoren kombinieren – 1+1 kann gleich 5 sein.
- **Höhere Detektionsreichweite und Punktdichte:** Durch die zentrale Verarbeitung kann das System feinere Bewegungsmuster von Fußgängern oder Fahrrädern unterscheiden und statische Hindernisse wie Steine besser von Bodenwellen trennen.

## Warum jetzt? – Algorithmen-Kontrolle wechselt zu den OEMs

Bislang lag das Know-how zur Radarsignalverarbeitung fest in den Händen der Tier-1-Zulieferer. Diese steuerten die gesamte Signalverarbeitung vom FFT-Spektrum über die Zielerkennung bis zur Dopplerauswertung. Die OEMs bekamen nur die fertige „Objektliste" – die Rohdaten blieben im Sensor verborgen. Das änderte sich erst mit leistungsfähigeren SoCs und speziellen Schnittstellen. NXP brachte mit dem „Radar Bridge" einen Chip, der zwischen MMIC und SerDes vermittelt, und integriert Radar-Signalverarbeitungs-IP (RSP IP) direkt in ADAS-SoCs. Auch TI verfolgt diesen Weg: Seine AWR-Serie unterstützt bereits RAW-Datenausgabe.„Der Grund für den späten Wechsel ist, dass die Algorithmen der Millimeterwellen- und Bildsensoren von den Tier-1 dominiert wurden. Jetzt, wo die Rechenleistung der SoCs massiv gestiegen ist, können die OEMs die Kontrolle selbst übernehmen", erklärt ein Ingenieur eines chinesischen Herstellers.

## Die drei Radartechnologien im Detail

### Millimeterwellenradar: Der Vorreiter, aber auch die größte Herausforderung

Die 4D-Millimeterwellenradar-Technologie hat sich bereits in Richtung Mehrchip-Architektur entwickelt. Der Markt unterscheidet zwei Wege: Die preisbewusste chinesische Linie setzt auf „1 SoC + 2 MMIC" in einer 6T8R-Konfiguration (6 Sende-, 8 Empfangskanäle), was insgesamt 48 virtuelle Kanäle (6×8) generiert. In einer weiteren Variante mit 8T8R (8×8) steigt die Anzahl auf 64 virtuelle Kanäle. Die europäische Linie geht noch weiter: mit „1 SoC + 4 MMIC" auf 12T16R (192 virtuelle Kanäle) oder direkt 16T16R (256). Manche Planungen sehen sogar 24T24R vor. Bis 2028 werden sich diese Wege in unterschiedlichen Kostenmodellen und Anwendungen fortsetzen. Die größte Hürde bleibt jedoch die Algorithmik: Wer besitzt die Radarsignal-IP? Wird sie in die zentralen SoCs integriert? Und kann die DSP-Einheit die Radardaten effizient verarbeiten, deren Datenstruktur sich grundlegend von Kamerabildern unterscheidet?

### Lidar: Je präziser, desto datenhungriger

Bei Lidar zielt die zentrale Architektur direkt auf Kosteneinsparung, da die interne FPGA- oder Signalverarbeitungshardware entfällt. Stattdessen übernimmt das zentrale SoC die gesamte Punktwolkenverarbeitung. Die aktuellen 192-Linien-Lidar-Sensoren erzeugen bei 10 Hz Bildwiederholrate, 120° horizontalem Sichtfeld und 0,1° Auflösung rund 3,6 Gbit/s Daten – das entspricht fast einem unkomprimierten 4K-Videostream. Die Übertragung über GMSL2 (6 Gbit/s) ist noch möglich, aber die Datenstruktur ist völlig anders als bei Bildsensoren: Lidar-Daten werden in Slots organisiert (z. B. 1200 Slots pro Frame mit Entfernung, Intensität und Reflektivität), was die MIPI-Schnittstellen und DSPs in den SoCs vor Herausforderungen stellt.

### Ultraschall: Einfach, aber technisch knifflig

Die Algorithmik für Ultraschallsensoren ist vergleichsweise simpel – Laufzeitmessung reicht aus. Bei zentraler Architektur entfällt die separate Signalverarbeitung im Sensor. BYD erreicht mit dieser Umstellung eine Reduktion der Verarbeitungslast um rund 20 % und eine Steigerung der Detektionspunktdichte um das Zehnfache. Die größte praktische Hürde ist die Verkabelung: Bei 12 Sensoren mit jeweils eigener SerDes-Leitung entsteht schnell ein **Kabelsalat**. Eine typische Lösung ist die Kombination aus lokaler Vorverarbeitung und zentraler Endverarbeitung: Im vorderen Stoßfänger wird ein Zwischenmodul platziert, das die Daten von 6 Sensoren bündelt und dann per einer Leitung zum SoC schickt – ohne dass ein Kabelsalat entsteht.

## Fazit

Die chinesische Automobilindustrie baut eine durchgehende Datenpipeline von den rohen Sensorsignalen bis zur endgültigen Entscheidung – ohne Blackbox dazwischen. Erst wenn die Daten kontrolliert werden, können Algorithmen ihr volles Potenzial entfalten. BYD hat mit dieser Architektur entscheidende Vorteile für den nächsten Entwicklungsschritt von L2+ zu L3.

---

Der Artikel beschreibt einen technologischen Trend chinesischer Hersteller; konkrete Markteinführungen in Deutschland sind nicht genannt.
