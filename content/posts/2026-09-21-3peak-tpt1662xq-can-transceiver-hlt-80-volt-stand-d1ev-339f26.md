---
title: "3PEAK TPT1662xQ: CAN-Transceiver hält 80 Volt stand"
date: 2026-09-21T07:33:46.592Z
description: "3PEAK stellt die CAN-Transceiver der Serie TPT1662xQ vor. Die Chips sind für 48-Volt-Bordnetze ausgelegt und halten Busspannungen bis ±80 Volt stand."
source: "D1EV"
image: "/images/3peak-tpt1662xq-can-transceiver-hlt-80-volt-stand-d1ev-339f26.webp"
category: "news"

brands: ["3PEAK"]
tags: ["Batterie", "Elektroauto", "Hybrid"]
draft: false
original_url: "https://www.d1ev.com/news/shichang/312958"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# 3PEAK TPT1662xQ: CAN-Transceiver hält 80 Volt stand

Der chinesische Halbleiterhersteller 3PEAK (思瑞浦) hat neue CAN-Transceiver vorgestellt: die Serien TPT1662VQ und TPT1662Q, die gemeinsam als TPT1662xQ vermarktet werden. Die Bausteine sind speziell für 48-Volt-Bordnetze entwickelt und sollen den Umstieg von der klassischen 12-Volt-Architektur auf das leistungsfähigere 48-Volt-System absichern. Erste Muster gehen bereits an mehrere chinesische und internationale Automobilhersteller sowie an Tier-1-Zulieferer.

## 48 Volt als Zwischenschritt zum Elektroauto

Das 48-Volt-Bordnetz gilt als wichtiger Zwischenschritt zwischen Verbrenner und reinem Elektroantrieb: Es kann viermal so viel Leistung übertragen wie ein 12-Volt-System, während der Kabelbaum rund 60 Prozent leichter ausfällt. Für die Elektronik bedeutet das jedoch deutlich höhere Anforderungen an die Spannungsfestigkeit. Die Norm ISO 21780:2020 legt für 48-Volt-Systeme eine Versorgungsspannung von bis zu 60 Volt fest; bei Überspannungstests werden sogar kurzzeitig 70 Volt über 40 Millisekunden gefordert. Bei einem Buskurzschluss mit Gleichtaktdrossel können die Spannungsspitzen am Chip auf bis zu 80 Volt steigen.

CAN-Knoten in einem 48-Volt-Netz müssen daher weit mehr aushalten als in einem 12-Volt-System. Hinzu kommt die Norm ISO 25769, die den „Masseverlust“ als Prüfkriterium festschreibt: Bricht die Masseverbindung eines Steuergeräts weg, kann sich die Gleichtaktspannung am Bus auf über 70 Volt aufschaukeln. Herkömmliche Transceiver mit einem Gleichtaktbereich von nur ±12 bis ±30 Volt geraten dabei außer Tritt, der Empfänger sättigt und die Kommunikation bricht ab — im schlimmsten Fall zieht ein einzelner Knoten den gesamten Bus mit.

## Der TPT1662xQ im Detail

Die neuen Bausteine wurden gezielt auf diese Extremfälle ausgelegt. Die wichtigsten Daten:

<ul>
<li>Bus-Fehlerfestigkeit: bis ±80 Volt, auch bei einminütigem Kurzschluss laut Hersteller ohne Schaden</li>
<li>Gleichtaktspannungsbereich: ±60 Volt; fehlerfreier Empfang bei 5 MBit/s nach Herstellerangaben</li>
<li>Datenrate: bis 8 MBit/s, unterstützt klassisches CAN und optimiertes CAN FD SIC</li>
<li>Kompatibel mit ISO 11898-2:2024, CiA601-4 sowie SAE J2284-1 bis J2284-5</li>
<li>Keine externe Gleichtaktdrossel nötig — spart Bauteile, Kosten und Platinenfläche</li>
<li>Direkter Ersatz für klassische CAN-Transceiver, ohne Änderungen an der Software</li>
<li>Vollständig in China gefertigt: von der Wafer-Produktion über das Chipdesign bis zu Packaging und Test</li>
</ul>

## Warum die Gleichtaktspannung entscheidend ist

Beim Masseverlust wird die Referenz des Steuergeräts auf das Potenzial der 48-Volt-Batterie gezogen. Messungen zufolge erreicht die Gleichtaktspannung am busnahen Chip dann kurzzeitig über 70 Volt. Der TPT1662xQ hält nach Herstellerangaben mehr als ±60 Volt aus und erkennt in diesem Bereich noch das Differenzsignal, sodass der Empfänger korrekt ausgibt. Vergleichsprodukte mit einem Gleichtaktbereich von ±20 bis ±30 Volt erzeugen in diesem Test Fehlerframes — der chinesische Baustein bleibt fehlerfrei.

## EMC-Tests und Kosten

In 48-Volt-Netzen muss ein Transceiver neben Hochspannungsimpulsen auch elektromagnetische Störungen wegstecken. 3PEAK verweist auf bestandene Interoperabilitäts- und EMC-Prüfungen inklusive BCI-Test (Bulk Current Injection). Weil der Chip ohne externe Gleichtaktdrossel alle Automotive-EMC-Tests besteht, sinken Bauteilkosten und Platinenfläche. Der Hersteller betont zudem die durchgängig lokale Wertschöpfungskette und positioniert die Serie als unabhängig verfügbare 48-Volt-Lösung für chinesische Hersteller.

===

---

Anders als bei einem Fahrzeugmodell geht es hier nicht um einen Marktstart, sondern um einen Halbleiterbaustein aus der Zulieferkette — 3PEAK ist kein Automobilhersteller. Für deutsche Autofahrer ist die Technik dennoch relevant, denn 48-Volt-Bordnetze stecken bereits in Mild-Hybriden und in der Nebenaggregate-Versorgung von E-Autos deutscher Marken; die Transceiver werden über Tier-1-Zulieferer eingekauft. 3PEAK beliefert nach eigenen Angaben bislang überwiegend chinesische Hersteller und Zulieferer, ein eigenes Vertriebs- und Servicenetz für Europa ist nicht bekannt. Für europäische und amerikanische Halbleiterkonzerne wie Infineon, NXP oder Texas Instruments bedeutet die hohe Busfestigkeit des TPT1662xQ zusätzlichen Wettbewerb im 48-Volt-CAN-Segment.
