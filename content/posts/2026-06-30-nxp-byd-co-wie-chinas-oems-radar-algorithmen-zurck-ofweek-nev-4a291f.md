---
title: "NXP, BYD & Co: Wie Chinas OEMs Radar-Algorithmen zurückerobern"
date: 2026-06-30T12:08:32.387Z
description: "Chinesische Hersteller ersetzen Blackbox-Sensoren durch zentrale Architektur: Rohdaten fließen direkt in SoC. NXP und TI liefern Schlüsselchips. Neue Kosten- und Leistungssprünge."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 5
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# NXP, BYD & Co: Wie Chinas OEMs Radar-Algorithmen zurückerobern

Die chinesische Automobilbranche durchlebt einen grundlegenden Wandel in der Architektur ihrer Fahrassistenzsysteme. Statt dass jeder Sensor – Radar, Lidar oder Kamera – seine eigene Signalverarbeitung durchführt und nur gefilterte Ergebnisse an ein Steuergerät sendet, setzt sich ein neues Konzept durch: die zentrale Sensorarchitektur. Dabei liefern die Sensoren rohe, unverarbeitete Messdaten direkt an einen leistungsstarken ADAS-SoC (System-on-a-Chip), der die Fusion und Interpretation aller Daten übernimmt.

## Was ist eine zentrale Sensorarchitektur?

Bisher arbeitete jedes Radar- oder Lidar-Modul wie eine „kleine Blackbox": Es erfasste Signale, führte Berechnungen durch – etwa FFT (Fast Fourier Transform) bei Radaren – und meldete dem Steuergerät lediglich „Ziel erkannt in 50 Metern" oder „kein Objekt". Die Informationen waren bereits stark komprimiert, Details gingen verloren.

Die zentrale Architektur hingegen überträgt die Rohdaten – bei Radaren etwa das FFT-Spektrum, bei Lidaren die Punktwolke – über Hochgeschwindigkeitsverbindungen wie SerDes (Serializer/Deserializer) oder GMSL an einen zentralen Rechner. Dieser SoC besitzt die gesamte Rechenleistung für eine echtzeitfähige Sensorfusion. Ein Beispiel: Regentropfen streuen das 4D-Radar-Signal, sodass ein Ziel unscharf erscheint. Die Kamera sieht durch Regen schlechter. Im alten System lieferten beide widersprüchliche Meldungen. In der zentralen Architektur kombiniert der Algorithmus die Rohdaten beider Sensoren – Radar mit seiner Regendurchdringung und Kamera mit ihrer Auflösung – zu einem zuverlässigen Gesamtbild. Das Ergebnis ist nicht 1+1=2, sondern kann 1+1=5 sein.

## Warum die Wende jetzt kommt – Algorithmus-Kontrolle wechselt den Besitzer

Der Schlüssel liegt im Algorithmus. Bisher hielten Tier-1-Lieferanten wie Bosch, Continental oder Hella das Know-how der Radarsignalverarbeitung in ihren Händen. Die Firmware in den Sensor-Modulen bestimmte, wie Ziele extrahiert, gefiltert und klassifiziert wurden. OEMs bekamen nur die Ergebnisse – die Blackbox blieb geschlossen.

Die zentrale Architektur bricht diese Monopolstellung. Künftig übernehmen die Sensoren nur noch die reine Hardware – MMIC (Hochfrequenz-Sendeempfänger) und ADC (Analog-Digital-Wandler) – und führen eine einfache 1D-FFT durch. Die gesamte komplexe Verarbeitung wandert in den zentralen SoC.

Ermöglicht wird dies durch neue Chip-Integrationen. NXP (恩智浦) hat einen speziellen Radar-Bridge-Chip entwickelt, der zwischen MMIC und SerDes geschaltet wird. Gleichzeitig integriert der Hersteller Radar-Signalverarbeitungs-IP (RSP IP) direkt in den ADAS-SoC – Algorithmen laufen künftig als IP-Blöcke auf dem Chip. TI (德州仪器) verfolgt eine ähnliche Route, seine AWR-Serie unterstützt bereits den RAW-Datenausgang.

Der Druck kommt von oben: L3/L4 autonomes Fahren (SAE-Klassifikation) erfordert höchste Sensorfusion. Einzelne Ziel-Listen reichen nicht mehr. Benötigt werden Rohdaten – Geschwindigkeits-Frequenzspektren, Mikro-Doppler-Profile – um etwa ein stationäres Fahrzeug von einer nahen Leitplanke oder einem Stein zu unterscheiden. Früher wäre der SoC mit 12 Radar-FFTs und CFAR (Constant False Alarm Rate) überlastet gewesen – heute sind die Prozessoren dafür stark genug.

Zukünftig werden Millimeterwellen-Radar und 4D-Radar nebeneinander existieren. Entscheidend ist: Wer kontrolliert den Algorithmus? Chinesische OEMs wählen zwei Wege: entweder eigene Algorithmen aufbauen (wie NIO oder BYD) oder auf Tier-1-Partner setzen. Die Architektur verschiebt die Macht.

## Gleiche „Rohdaten", unterschiedliche Wege: Drei Sensortypen im Detail

Die zentrale Architektur betrifft Radar, Lidar und Ultraschall gleichermaßen – aber mit unterschiedlichen Herausforderungen.

**4D-Radar (Millimeterwellen-Radar):** Der Wandel kommt schnell. In China setzt sich die kosteneffiziente Route durch: 1 SoC + 2 MMICs ergeben 8T8R (8 Sende-/8 Empfangskanäle). Europa geht auf 1 SoC + 4 MMICs = 16T16R, einige planen direkt 24T24R. Bis 2028 werden sich die Pfade trennen – je nach Kostenmodell und Anwendung. Die Hürden liegen nicht in der Hardware, sondern in der Algorithmus-Dynamik. Erste Frage: Wer hält die Radar-Algorithmus-IP? Zweite: Wer kann die IP auf die Plattform portieren und validieren? Dritte: Die MIPI-Schnittstelle des SoC ist für Kameras optimiert – Radar-Daten (3D/4D-Array) passen nicht in das Frame-Format. Ob DSP die Rechenarbeit effizient leisten kann, ist offen. Hier baut NXP mit seinem RSP IP eine Mauer gegen die alte Tier-1-Algorithmen-Community.

**Lidar:** Hier geht es vor allem um Kostenersparnis. Im zentralen Modell entfällt das FPGA im Lidar-Modul, das bisher die Signalverarbeitung übernahm. Übrig bleiben Laserdiode, SPAD-Empfänger und TDC (Time-to-Digital-Converter) – Hardwarereste, die sich günstig bündeln lassen. Die Hersteller arbeiten an der Ausgabe: Aktuelle Automotive-Lidare haben einen SPAD-Sensor mit MIPI-Schnittstelle wie eine CMOS-Kamera – technisch kompatibel. Die größte Herausforderung ist die Datenmenge. Ein 192-Linien-Lidar mit 10 Hz, 120° horizontalem Sichtfeld und 0,1° Auflösung erzeugt pro Frame rund 3,6 Gbps. GMSL2 mit 6 Gbps reicht knapp. Die Datenstruktur unterscheidet sich fundamental von Kamerabildern: Lidar-Daten sind nach Slots organisiert (z. B. 1200 Slots pro Frame, jeder mit Wellenform-Information). Ein direktes Einspeisen in den für Kamera optimierten MIPI-Pfad und DSP führt zu Ineffizienz – CPU/GPU-Missbrauch droht.

**Ultraschall:** Der einfachste Fall. Die Algorithmen sind relativ simpel – Laufzeitmessung statt Signalverarbeitung. In der zentralen Architektur werden alle Rohdaten zum Steuergerät übertragen. Der Rechenaufwand steigt um etwa 20 %, die Zielauflösung verbessert sich auf das Zehnfache. Dank feinerer Matched-Filter-Algorithmen lassen sich mehr Informationen extrahieren. Allerdings benötigt jedes der typisch 12 Ultraschallsensoren eine eigene SerDes-Leitung – Kosten und Anschlussaufwand steigen. Ein praktischer Kompromiss: „lokal fusionsieren + zentral nachverarbeiten". So verbaut BYD (比亚迪) in seinem High-End-System sechs Sensoren vorn, sechs hinten, bündelt die Daten vor und lädt sie dann hoch. Ergebnis: Rechenlast +20 %, Reichweite +20 %, Auflösung +10 %. BYD nennt es „teils zentral, teils lokal" – eine pragmatische Mittelstufe.

## Fazit

Die chinesische Automobilindustrie baut die Datenpipeline der Sensorik radikal um: Vom fertigen Ziel zum rohen Signal – dazwischen keine Blackbox. Nur mit diesen Rohdaten können Algorithmen ihr volles Potenzial entfalten, und nur dann schließen chinesische Hersteller die Lücke zu den etablierten Tier-1-Lieferanten. Nach diesem Umbau werden mehr Sensordaten zur Verfügung stehen, um den nächsten Schritt von L2+ zu L3 zu wagen.

---

Keine Modellverfügbarkeit – reiner Technologie- und Branchenartikel. Die beschriebenen Chip- und Architektur-Entwicklungen betreffen globale Zulieferer und haben keine direkte Modellbindung.
