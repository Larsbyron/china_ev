---
title: "BYD setzt auf zentrale Radar-Fusion: 20 % mehr Erkennungsreichweite"
date: 2026-06-13T19:14:27.534Z
description: "BYD wechselt in einem Serienmodell von dezentraler zu zentraler Sensorarchitektur. 4D-Radar-Rohdaten werden in einem SoC fusioniert – Erkennungsreichweite und Rechenzeit verbessern sich um 20 %. Ein Schritt zu L3/L4."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD setzt auf zentrale Radar-Fusion: 20 % mehr Erkennungsreichweite

Die chinesische Automobilindustrie vollzieht einen grundlegenden Wandel: Statt dass jeder Radar- oder Lidarsensor die Rohdaten selbst vorverarbeitet, werden die ungefilterten Signale künftig in einem zentralen High-Performance-SoC (System-on-Chip) im Fahrzeug zusammengeführt. Die Algorithmen wandern vom Zulieferer zum Autohersteller oder dessen Chip-Partner.

BYD (比亚迪) hat diesen Schritt bereits in einem aktuellen Serienmodell umgesetzt. Die neue zentrale Architektur reduziert die Rechenzeit um 20 % und erhöht die *Erkennungsreichweite* der Radarsensorik um 20 %. Konkret bedeutet das: 4D-Radar-Punktwolken mit Mikrodoppler-Informationen ermöglichen eine präzise Unterscheidung zwischen Fußgängern, Motorrädern oder umgestürzten Steinen – ein entscheidender Vorteil für höhere Automatisierungsstufen (L3/L4).

## Warum der Wechsel jetzt kommt

Bislang arbeiteten die Sensoren dezentral: Jeder Millimeterwellen-Radar führte selbst FFT-Berechnungen, Zielerkennung und Doppler-Auswertung durch und lieferte nur eine verdichtete Objektliste – etwa „50 m voraus ein Hindernis“. Die Rohdaten (Frequenzspektrum, Radar-RAW-Cubes, Punktwolken) gingen verloren.

„Mit der dezentralen Verarbeitung war das Wissen über die Umgebung bereits stark reduziert“, erklärt ein BYD-Ingenieur. „Für L2 reichte das, aber für L3/L4 brauchen wir das volle Signal.“ Treiber des Wandels sind neue Chip-Generationen: NXP hat mit dem Radar Bridge einen speziellen Bridge-Chip zwischen MMIC (Monolithischer Mikrowellen-IC) und SerDes (Serializer-Deserializer) entwickelt. Gleichzeitig integrieren ADAS-SoC-Hersteller zunehmend eigene Radar-Signalverarbeitungs-IP (RSP IP). Der Know-how-Vorteil der Zulieferer schmilzt dahin.

## BYD als Vorreiter der zentralen Fusion

BYD setzt auf eine hybride Lösung: Im vorderen Stoßfänger sind sechs 4D-Radar-Sensoren verbaut, deren Rohdaten über einen zentralen Hub zusammengeführt werden. Laut Unternehmen sinkt die Latenz um 20 %, die maximale Erkennungsreichweite steigt um 20 % und die Punktdichte des 4D-Radars verzehnfacht sich. Das System arbeitet mit einer „teilzentralen“ Architektur – ein Kompromiss zwischen vollständiger Dezentralisierung und kompletter Zentralisierung.

Die Herausforderungen bleiben jedoch groß: Die Radardaten (z. B. 3,6 Gbit/s bei 192-Laser-Lidar) müssen über teure SerDes-Leitungen übertragen werden. Zudem unterscheidet sich die Datenstruktur von Radaren (Slot-basiert) fundamental von der bildhaften Struktur von Kameras, was eine effiziente Verarbeitung im SoC erschwert. Dennoch gehen Branchenexperten davon aus, dass sich die zentrale Sensorfusion bis 2028 durchsetzen wird – sowohl bei 8T8R- als auch bei 24T24R-Radarsystemen.

## Fazit: Algorithmen entscheiden, nicht die Hardware

Die chinesische Automobilindustrie baut die „Blackbox“ der Zulieferer ab: Vom Sensor zum SoC fließen nun rohe Signale, keine vorgefilterten Objektlisten. Wer die Algorithmen beherrscht, kontrolliert die Wahrnehmung. BYD geht mit diesem Schritt voran – und ebnet den Weg für höhere Autonomiestufen, die in China bereits getestet werden.

---

Die Technologie ist Teil der globalen Entwicklung chinesischer Hersteller. Eine konkrete Markteinführung in Europa ist noch nicht bestätigt, doch BYD plant, seine fortschrittlichen Fahrassistenzsysteme auch in Exportmodellen auszurollen.
