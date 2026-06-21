---
title: "3PEAK: Neue 80V-VCSEL-Treiber für präzises Lidar"
date: 2026-06-21T12:11:07.843Z
description: "Der Chip-Hersteller 3PEAK präsentiert Treiber für Fahrzeug-Lidar, die 20–50 A in Nanosekunden schalten. Die Technik ermöglicht präzisere Abstandsmessung und Augensicherheit. Auch deutsche Zulieferer könnten profitieren."
source: "D1EV"
image: "/images/3peak-neue-80v-vcsel-treiber-fr-przises-lidar-d1ev-f0e091.webp"
category: "news"

brands: ["3PEAK"]
tags: ["Sicherheit"]
draft: false
original_url: "https://www.d1ev.com/news/shichang/303594"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# 3PEAK: Neue 80V-VCSEL-Treiber für präzises Lidar

3PEAK (思瑞浦) hat ein Whitepaper zu seinen neuen VCSEL-Treibern für Automotive-Lidar veröffentlicht. Die Chips liefern Strompulse von 20 bis 50 Ampere bei Spannungen von 60 bis 80 Volt und schalten innerhalb weniger Nanosekunden. Ziel: Lidar-Systeme für hochautomatisiertes Fahren ab Stufe 2+.

## Warum 60–80 V und Nanosekunden-Pulse?

Lidar misst die Laufzeit von Laserpulsen (dToF – direct Time of Flight). Je steiler der Strompuls ansteigt, desto genauer wird die Distanz. Eine Nanosekunde Verzögerung erzeugt bereits 15 cm Messtoleranz. Die Herausforderung: Die parasitäre Induktivität der Leiterbahnen erzeugt bei schnellen Stromänderungen Spannungsspitzen (V = L × di/dt). Sechs- bis zehnfach gestapelte VCSEL-Laser benötigen daher Treiberspannungen bis 80 V – ein Wert, der für Hochvolt-Antriebe im Auto zwar ungewöhnlich, für Lidar aber notwendig ist.

## Architektur: Laden wie ein Blitz, feuern wie ein Blitz

3PEAK setzt eine „High-Side-Ladung + Low-Side-Puls"-Topologie ein – ähnlich einem Kamerablitz. Eine Boost-Schaltung lädt lokale Kondensatoren langsam auf; ein Low-Side-Schalter entlädt sie explosionsartig in den VCSEL. Langsames Laden und schnelles Entladen sind entkoppelt.

Für 2-D-adressierbare VCSEL-Arrays (rein elektronisches Scannen) werden mehrere Kanäle parallel geschaltet. Das ermöglicht regionale Leistungssteuerung: Stark reflektierende Ziele wie Nummernschilder können gezielt mit reduzierter Intensität bestrahlt werden, um Überstrahlung zu vermeiden. Die 2-D-Architektur erhöht die Photoneneffizienz und senkt die thermische Last, da jeder Emitter nur kurz feuert.

## Augensicherheit und Fehlerschutz

Ein einzelner Laserpuls übersteigt den zulässigen Grenzwert der Augenschutzklasse 1 (IEC 60825-1) um das 10- bis 100-Fache. Die Sicherheit wird nur durch ein extrem niedriges Tastverhältnis unter 0,1 % erreicht. Kritisch: Ein Kurzschluss des Low-Side-Schalters würde den Laser dauerhaft leuchten lassen – mit potenziell gefährlicher Leistung.

3PEAK setzt daher auf eine Dual-Chip-Architektur: Der High-Side-Ladechip kann bei einem Fehler selbstständig die Energiezufuhr unterbrechen und die Kondensatoren entladen, selbst wenn der Low-Side-Chip komplett ausfällt. Das erfüllt die Anforderungen an funktionale Sicherheit nach ASIL B und höher.

## Produktfamilie und Praxisbezug

3PEAK bietet eine ganze Familie an: Den High-Side-Lade-IC TPM8909Q (16 Kanäle, 80 V), Low-Side-Puls-IC TPM8918Q (8 Kanäle, 20 A), den hochintegrierten Einzelchip TPM8915Q (80 V/50 A, 1 ns Pulsbreite in einem WLCSP von 3,35 × 1,65 mm) sowie GaN-Treiber (TPM1025Q, TPM2025Q) für MEMS- oder Scanning-Systeme. Die Integration reduziert die Bauteilzahl von 50 auf 20–30.

Solche Treiber kommen in Lidar-Systemen zum Einsatz, die bereits in chinesischen Fahrzeugen verbaut sind – etwa in XPengs Stadtpilot (XNGP) oder Baidu Apollos Robotaxi-Plattform. Auch deutsche Tier-1-Zulieferer wie Bosch oder Valeo entwickeln Lidar und könnten von den kompakten, leistungsfähigen Chips profitieren.

---

Die Treiberchips von 3PEAK sind für den europäischen Markt derzeit nicht angekündigt und nicht über offizielle Distributionskanäle erhältlich. Eine Evaluierung durch europäische Tier-1-Zulieferer oder Lidar-Hersteller ist nach Kenntnisstand der Redaktion nicht bekannt.
