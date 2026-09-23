---
title: "Li Auto L9 Livis: OTA 9.1.0 enttäuscht mit 71 Punkten"
date: 2026-09-23T14:10:13.299Z
description: "Li Auto hat das Fahrassistenz-Update 9.1.0 für den L9 Livis veröffentlicht. Im Stadt-Test erreicht die Software nur 71 Punkte — fünf weniger als Version 8.3.0."
source: "OFweek NEV"

category: "news"
brand: "Li Auto"
brands: ["Li Auto"]
tags: ["Li Auto", "Sicherheit"]
draft: false
original_url: "https://nev.ofweek.com/2026-08/ART-77015-8330-30700339.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "china_only"
---

# Li Auto L9 Livis: OTA 9.1.0 enttäuscht mit 71 Punkten

Li Auto (理想) hat für sein Flaggschiff-SUV L9 Livis das Over-the-Air-Update OTA 9.1.0 ausgerollt. Es soll das Fahrassistenzsystem (ADAS) im Stadtverkehr verbessern und erstmals vollständig auf der neuen Eigenentwicklung „Mach VLA" laufen. Ein Test des chinesischen Fachportals Xauto im Stadtverkehr fällt jedoch ernüchternd aus.

## Nur 71 von 100 Punkten im Stadt-Test

Im standardisierten Test erreichte OTA 9.1.0 bei den objektiven Prüfpunkten lediglich 42 Punkte; neun Prüfpunkte wurden nicht bestanden — zwei mehr als bei der zuvor getesteten Version 8.3.0. In zwei Kategorien fiel das System in beiden Versionen durch: ungeschütztes Linksabbiegen sowie Rechtsabbiegen an engen Kreuzungen. Auch bei zwei Engstellen-Durchfahrten und zwei Drei-Punkt-Wendemanövern blieb es ohne Punkte.

Besonders auffällig: Prüfpunkte, die die alte Version 8.3.0 noch sauber schaffte, gingen in 9.1.0 verloren — etwa unregelmäßige Fahrbahnmarkierungen, die Einfahrt in einen Kreisverkehr und mehrfaches Kreisfahren in Folge. Die Tester sehen darin ein Zeichen dafür, dass die neue Architektur die alte noch nicht vollständig abgelöst hat.

## Subjektive Bewertung: 29 von 40 Punkten

Neben den Prüfpunkten bewerteten die Tester vier subjektive Kategorien:

- **Konformität (7 Punkte):** Verbesserung gegenüber 8.3.0. Kritikpunkte: An einer roten Ampel setzte sich das Fahrzeug unvermittelt in Bewegung, obwohl es bereits stand; bei aufeinanderfolgenden Spurwechseln fuhr es kurzzeitig gegen die Fahrtrichtung; beim Kreisfahren mangelte es an Rücksicht auf Fußgänger.
- **Effizienz (6 Punkte):** Zahlreiche unnötige Spurwechsel trüben das Bild. Das System antizipiert die Fahrlinien anderer Verkehrsteilnehmer zu wenig, wählt teils die langsamere Spur und schert beim Rechtsabbiegen zu früh aus — und landet hinter einem Bus. Auch der Abstand zum Vorderfahrzeug im Stadtverkehr ist zu groß, weshalb andere Autos häufiger einscheren.
- **Sicherheit (6 Punkte):** Die Kurvengeschwindigkeit wurde verbessert, der Einstieg in die Kurve ist aber noch etwas zu schnell. Beim Einscheren anderer Fahrzeuge (Cut-in) reagiert die Software zu träge — in einem Fall kam es fast zum Unfall. Beim Umfahren eines parkenden Fahrzeugs wollte sie trotz Gegenverkehr ausscheren; der Fahrer musste eingreifen.
- **Komfort (10 Punkte):** keine auffälligen Störungen.

## Li Autos ADAS-Linie: vier Hardware-Stufen, eine Software

Li Auto verfolgt bei der Fahrassistenz eine Strategie aus gestaffelter Hardware und einheitlich per OTA aktualisierter Software:

- **AD Pro (Einstieg, Horizon-Plattform):** ältere Modelle (L7/L8/L9, Baujahre 2022–2024) mit Horizon Journey 5, 128 TOPS, ohne Lidar — nur Autobahn-Pilot, kein Stadtpilot. Die 2025er „Smart Refreshed"-Modelle (L6/L9) erhalten den Journey 6M samt Hesai-Lidar und 2026 per OTA 4.0 einen End-to-End-Stadtpilot — aber ohne VLA-Modell und mit eigenem Algorithmus-Stack.
- **AD Max (1. Generation, dual Orin X):** Modelle 2022–2024 (L7/L8/L9, MEGA) mit 508 TOPS, Lidar und elf Kameras. Autobahn- plus Stadtpilot, End-to-End-Architektur mit VLM. Ab 2025 per OTA das VLA-Fahrermodell als destillierte Version.
- **AD Max (Thor U):** L6/L9 Max/Ultra (2025) sowie i8 und i6 mit einem Thor U und 700 TOPS. Ab Werk VLA-fähig, destilliertes Mach-VLA per OTA 8.6.
- **Mach M100 (neue Eigenentwicklung, Spitze):** aktuelle L9/L8 Ultra und Livis sowie L6 Ultra. Der Livis nutzt zwei M100-Chips mit 2.560 TOPS und drei schwenkbare Lidars für 360-Grad-Rundumsicht. Hier läuft das volle „Mach VLA" — inklusive Weltmodell, Agent-Funktionen und Sprachsteuerung für das Fahrzeug.

## Von Regeln zu VLA

Die Software-Architektur durchlief vier Stufen: klassische regelbasierte Module (nur Autobahn), End-to-End plus VLM (Vision-Language-Modell) ab 2024, das VLA-Fahrermodell (Vision-Language-Action-Modell, das Bild-, Sprach- und Handlungsdaten kombiniert) ab 2025 und schließlich das Mach VLA auf Basis des MindVLA-o1-Modells ab 2026. Nur auf der Mach-M100-Plattform läuft die Software ohne Destillation, also mit voller Leistung; auf älteren Plattformen wird sie per OTA beschnitten ausgerollt.

## Fazit: Reifegrad noch nicht ausreichend

Mit 71 Punkten liegt die 9.1.0 fünf Punkte unter der Vorgängerversion 8.3.0 und damit unter den Erwartungen. Der Umstieg auf eine neue Architektur erklärt einen Rückschritt zum Teil, doch die Tester erkennen weiterhin Altlasten. Für kurze, zufällige Stadtfahrten möge die Software genügen; im Langzeittest zeigten sich viele kleine Schwächen — zögerliche Spurwahl, träge Reaktion auf einscherende Fahrzeuge, verspätete Spurwechsel und missglücktes Ausscheren. Ein weiteres Update ist bereits für Dezember angekündigt.

---

## In Deutschland nicht erhältlich

Li Auto hat bislang keine offiziellen Pläne für eine Expansion nach Europa bekannt gegeben. Das Unternehmen konzentriert sich auf den chinesischen Markt. Die hier beschriebenen Fahrassistenz- und OTA-Funktionen sind damit für deutsche Käufer derzeit nicht verfügbar.
