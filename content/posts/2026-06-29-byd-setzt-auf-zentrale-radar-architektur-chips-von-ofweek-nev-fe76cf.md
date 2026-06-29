---
title: "BYD setzt auf zentrale Radar-Architektur: Chips von NXP und TI"
date: 2026-06-29T06:41:54.230Z
description: "Die Ära dezentraler Sensoren endet: Chinesische Hersteller wie BYD bauen ihre E-Autos auf eine zentrale Rechner-Plattform um. Das verschiebt die Macht von Tier-1-Zulieferern zu Chip-Entwicklern."
source: "OFweek NEV"

category: "news"

brands: ["NXP", "TI", "NVIDIA", "Qualcomm"]
tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD setzt auf zentrale Radar-Architektur: Chips von NXP und TI

Chinas Automobilindustrie steuert auf eine neue Architektur für automatisiertes Fahren zu: Statt dezentraler Sensoren mit eigener Vorverarbeitung setzen immer mehr Hersteller auf ein zentrales System-on-Chip (SoC), das die Rohdaten von Radar, Lidar und Kameras direkt fusioniert. Bisher arbeitete jeder Radarsensor als eigenständiger Mikrocontroller: Er erfasste das Signal, führte eine Fast-Fourier-Transformation (FFT) durch, filterte Ziele, maß Abstand und Geschwindigkeit – und sendete nur eine reduzierte Objektliste an das Steuergerät. Beim neuen Konzept fließen die unverarbeiteten Rohsignale – etwa das FFT-Frequenzspektrum eines Millimeterwellen-Radars – in einen gemeinsamen Algorithmus, der alle Sensorarten kombiniert. Das löst das klassische Dilemma: Bisher meldete ein Radar „Hindernis in 50 Metern“, ein anderes „nichts in 30 Metern“ – ein Widerspruch, der in der Zentrale nicht aufgelöst werden konnte. Mit den Rohdaten kann der Algorithmus beide Quellen gewichten und zu einem plausibleren Ergebnis kommen.

## Warum sich die Kontrolle verschiebt

Der Grund für den Wandel: Bisher kontrollierten Tier-1-Zulieferer wie Bosch oder Continental das Know-how der Radar-Signalverarbeitung. Die Algorithmen zur FFT, Zielerkennung und Doppler-Auswertung waren in der Firmware der Sensoren versteckt – eine Blackbox, die kein Autohersteller öffnen konnte. Die zentrale Architektur entmachtet die Tier-1: Der Autohersteller übernimmt die volle Kontrolle über die Verarbeitungskette. Dafür braucht er leistungsstarke SoCs und spezielle Brücken-Chips. NXP (NXP Semiconductors) hat einen Radar-Bridge-Chip vorgestellt, der zwischen dem MMIC (Monolithic Microwave Integrated Circuit) und der SerDes-Schnittstelle vermittelt. Gleichzeitig integriert NXP Radar-Signalverarbeitungs-IP (RSP) direkt in seine ADAS-SoCs – damit können die Algorithmen direkt auf dem Chip ausgeführt werden, ohne Umweg über einen separaten Prozessor. Texas Instruments (TI) verfolgt eine ähnliche Strategie: Seine AWR-Serie unterstützt nativ RAW-Datenausgabe. Ab den Stufen 3 und 4 des autonomen Fahrens reichen einfache Objektlisten nicht mehr aus – erforderlich sind Rohdaten wie Entfernung-Doppler-Spektren, um zwischen einem stehenden Hindernis und einem herannahenden Objekt unterscheiden zu können. Der SoC muss dann bis zu 12 Kanäle Radar-FFT und CFAR in Echtzeit bewältigen – eine Herausforderung, die die Chiphersteller durch Integration lösen.

## Drei Radartypen – unterschiedliche Wege ins Zentrum

Nicht alle Radarsensoren sind gleich betroffen. Die Millimeterwellen-Radare (4D-Radar) sind die komplexesten: In China setzen viele Hersteller auf eine kosteneffiziente 8T8R-Konfiguration (1 SoC + 2 MMIC), während europäische Zulieferer auf 16T16R setzen und für 2028 sogar 24T24R planen. Der Engpass liegt nicht in der Hardware, sondern in der Algorithmen-IP: Wer die Radar-Signalverarbeitung beherrscht – und ob diese auf den SoC portiert werden kann – wird über die zukünftige Machtverteilung entscheiden. Zudem ist die Datenorganisation eine Hürde: Radar-Daten sind range-Doppler-2D-Matrizen, die sich fundamental von den frame-basierten Bilddaten einer Kamera unterscheiden. Die DSP-Einheiten in den SoCs müssen für diese Struktur optimiert sein, sonst brechen Effizienz und Leistung ein.

Bei Lidars ist der Wandel direkter: Da der Laser-Scanner bereits rohe Pointclouds liefert, entfallen teure FPGAs oder Signalprozessoren im Sensor. Die Kosten sinken, weil nur noch Sender, SPAD-Empfänger und TDC als Hardware übrig bleiben. Allerdings erzeugen hochauflösende Lidars (z. B. 192 Linien, 0,1° Auflösung, 10 Hz Bildrate) Datenströme von rund 3,6 Gbit/s – das überfordert die klassischen GMSL2-Schnittstellen. Auch hier müssen die SoCs die Daten effizient verarbeiten können, was nicht trivial ist.

Ultraschall-Radare sind algorithmisch am einfachsten: Ihre Rohdaten (Laufzeitmessungen) lassen sich ohnehin zentral auswerten. Die Herausforderung liegt in der Verkabelung: Bei 12 Sensoren bräuchte man 12 SerDes-Leitungen. Ein Kompromiss ist ein Hybrid aus lokaler Vorverarbeitung und zentraler Auswertung – genau diesen Weg geht BYD (比亚迪) bei seinen neuesten Modellen. Der Hersteller berichtet von einer Reduktion der Latenz um rund 20 %, einer Steigerung der Erkennungsreichweite um rund 20 % und einer Verzehnfachung der Punktdichte – ohne die Kosten für eine vollständig zentrale Verkabelung zu tragen.

## Fazit: Die Ära der Blackbox endet

Die chinesische Autoindustrie baut eine transparente Datenpipeline auf: vom Rohsignal über den Algorithmus bis zur Entscheidung – keine Blackbox mehr. Nur wenn die Daten die Algorithmen erreichen, können die Algorithmen das volle Potenzial des autonomen Fahrens entfalten. Nach den Kameras folgen nun die Radare. Ab Stufe 3 werden die ersten Serienfahrzeuge diese zentrale Architektur in die Praxis umsetzen.

---

Die beschriebene Technologie betrifft aktuell vor allem den chinesischen Markt. BYD bietet in Deutschland Fahrzeuge wie den BYD Atto 3, Han und Seal an – diese Modelle nutzen noch die herkömmliche dezentrale Sensorarchitektur. Eine Einführung der neuen zentralen Radar-Architektur in Europa ist bisher nicht offiziell angekündigt. NXP und TI sind als europäisch-amerikanische Chipkonzerne jedoch global aufgestellt, sodass die Technologie prinzipiell auch in europäischen Fahrzeugen eingesetzt werden könnte.
