---
title: "BYD Xuanji: Zentrale Sensorfusion ab 2025"
date: 2026-06-24T12:17:33.171Z
description: "BYD stellt mit „Xuanji' eine zentrale Architektur vor, die rohe Sensordaten direkt in einem SoC fusioniert. Das System verbessert die Objekterkennung massiv und bereitet den Weg für höhere Autonomiestufen."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# BYD Xuanji: Zentrale Sensorfusion ab 2025

BYD (比亚迪) revolutioniert mit seinem ab 2025 eingesetzten „Xuanji"-System die Arbeitsteilung in der Fahrassistenz. Statt dezentraler Blackbox-Vorverarbeitung bündelt die neue Architektur sämtliche Rohdaten von Radar, Lidar und Kamera in einer zentralen Recheneinheit (SoC). Das Ergebnis: eine deutlich präzisere Umfelderkennung, die Wetter- und Lichtsituationen intelligent ausgleicht.

## Was ist die zentrale Fusionsarchitektur?

Bisher arbeiteten Sensoren weitgehend autonom: Jedes Millimeterwellen-Radar, Lidar oder Kamera-Modul verfügte über einen eigenen Mikrochip, der vor Ort Ziele identifizierte und nur abstrakte Objektlisten („Hindernis 50 Meter voraus") an das Steuergerät sendete. Diese Vorverarbeitung wirft jedoch wertvolle Details wie Reflexionsstärken oder Doppler-Verschiebungen weg – etwa zur Unterscheidung von Fußgängern und Radfahrern.

BYDs Xuanji-Architektur dreht den Prozess um: Hochgeschwindigkeits-SerDes-Leitungen (Serializer/Deserializer) leiten unverarbeitete Rohdaten – FFT-Spektren des Radars, Punktwolken des Lidars – an eine zentrale Recheneinheit. Dort fusioniert ein einheitlicher Wahrnehmungsalgorithmus die Informationen aller Sensoren, ähnlich dem menschlichen Gehirn. Kann die Kamera bei Regen kaum etwas erkennen, gleicht das energieintensive Radarsignal die Lücken aus.

## Warum erst jetzt? – Der Machtkampf um die Radar-Algorithmen

Der Hauptgrund für die späte Einführung liegt in der traditionellen Arbeitsteilung: Tier-1-Zulieferer kontrollierten jahrzehntelang die Signalverarbeitungs-Algorithmen in Radar und Lidar. Sie lieferten fertige Blackboxen – die Autohersteller bekamen nur den Output, nie das Know-how.

Xuanji entmachtet diese Zulieferer. BYD übernimmt die volle Kontrolle über die Datenpipeline: Statt eines kompletten Radarmoduls liefern die Zulieferer nur noch die reine Hardware (MMIC, Antenne). Die gesamte Signalverarbeitung – FFT (Fast Fourier Transform), CFAR (Constant False Alarm Rate), Doppler-Analyse – wird in den zentralen SoC verlagert. Ermöglicht wird dies durch leistungsstarke Chips und neue Schnittstellen wie NXPs Radar Bridge oder TIs AWR-Serie, die rohe Radardaten direkt ausgeben.

## Drei technische Herausforderungen – und wie BYD sie löst

Das Xuanji-System bringt drei spezifische Hürden für die unterschiedlichen Sensortypen mit sich:

- **Millimeterwellen-Radar (4D-Radar):** Der chinesische Markt setzt auf eine kosteneffiziente 8T8R-Architektur (1 SoC + 2 MMIC), Europa dagegen auf 12T16R oder sogar 24T24R (1 SoC + 4 MMIC). Bis 2028 werden sich diese beiden Pfade je nach Kostenmodell und Einsatzszene weiter ausdifferenzieren. Die größte Hürde ist nicht die Hardware, sondern die Algorithmus-IP: Wer besitzt sie, und wer kann sie effizient auf den SoC portieren? Hinzu kommt, dass Radar-Datenstrukturen (2D/3D-Arrays) nicht zu den für Kameras optimierten MIPI-Schnittstellen passen.

- **Lidar:** Die Hardware wird günstiger – die zentrale Verarbeitung spart das teure FPGA im Lidar. Allerdings erzeugt ein 192-Zeilen-Lidar mit 10 Hz Bildrate und 0,1° Auflösung rund **3,6 Gbps** Rohdaten. Die 6 Gbps eines GMSL2-Links reichen gerade so – aber die Datenstruktur (1200 Slots pro Frame mit Laufzeit, Intensität, Doppler) unterscheidet sich fundamental von einem Kamerabild. Effiziente Verarbeitung auf dem SoC bleibt eine Herausforderung.

- **Kameras (optische Sensoren):** Die Fusionsarchitektur vereinfacht die Verarbeitung (z. B. keine separate Signalverarbeitung), aber die Anzahl der Kameras steigt – typisch 12 an der Zahl. Jede benötigt eine SerDes-Leitung, was die Kosten und die Komplexität der Verkabelung erhöht. BYD wählt daher einen Hybrid-Ansatz: lokale Vorverarbeitung an der Stoßstange (Rohdaten-Verdichtung) und dann Upload in die Zentraleinheit.

## Fazit: Kontrollverlust der Zulieferer

Die chinesische Automobilindustrie baut eine vollständige Datenpipeline auf – vom Rohsignal bis zur Entscheidung, ohne jede Blackbox. Dieser Schritt bereitet den Weg für höhere Autonomiestufen (L2+ bis L3). Nach den Kameras folgen nun Radar und Lidar der Zentralisierung.

---

Das Xuanji-System wird ab 2025 in BYD-Modellen eingesetzt. Eine Einführung in Europa ist für die nächste Modellgeneration geplant. Deutsche Zulieferer wie Bosch und Continental setzen dagegen weiterhin auf dezentrale Blackbox-Architekturen – der Wettbewerb um die Software-Hoheit in Fahrassistenzsystemen verschärft sich.
