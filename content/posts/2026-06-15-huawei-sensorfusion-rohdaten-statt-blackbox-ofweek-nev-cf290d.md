---
title: "Huawei-Sensorfusion: Rohdaten statt Blackbox"
date: 2026-06-15T15:40:52.476Z
description: "Huawei treibt die zentrale Sensorarchitektur voran: Radar, Lidar und Kameras senden nur noch Rohdaten an eine Recheneinheit. Das steigert die Präzision, verlagert aber die Kontrolle von Tier-1-Zulieferern zu Chip- und Softwarehäusern. Eine Analyse der technischen Revolution."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "Huawei", "NXP", "Texas Instruments"]
tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Huawei-Sensorfusion: Rohdaten statt Blackbox

Bislang arbeiteten Fahrassistenzsysteme nach dem „jeder Sensor für sich"-Prinzip: Ein Millimeterwellenradar ermittelte eigenständig Abstand und Geschwindigkeit, ein Lidar erzeugte eine Punktwolke, die Kamera lieferte ein fertiges Objektlisting. Erst im zentralen Steuergerät wurden diese fragmentierten Daten – bereits gefiltert und verdichtet – zu einem Umweltmodell zusammengesetzt. Dabei ging zwangsläufig Information verloren, etwa schwache Ziele, die ein Radarecho wegen Regens verwarf oder die ein Lidar wegen schwacher Reflexion übersah.

## Der Paradigmenwechsel: Rohdaten-Fusion

Huawei (华为) propagiert nun einen grundlegenden Wandel: die zentrale Sensorarchitektur. Statt jeder Sensor verarbeitet seine Signale lokal und schickt nur Ergebnislisten, senden Radareinheiten künftig unverarbeitete Rohdaten – etwa die FFT-Spektren oder die komplexen I/Q-Samples – per GMSL-SerDes an eine leistungsstarke Fahrzeug-SoC (System-on-Chip). Erst dort läuft die gesamte Verarbeitung: von der Pulskompression über die CFAR-Detektion bis zur Sensorfusion. Das ermöglicht eine echte Kooperation der Sensoren. Ein Millimeterwellenradar, dessen Wellen durch Wassertropfen streuen und entfernte Objekte verschwimmen lassen, kann seine Daten mit denen eines Lidars kombinieren, dessen Laserstrahlen den Regen kaum beeinflussen. „Aus 1+1 wird nicht 2, sondern manchmal 5", beschreibt ein Entwickler den Vorteil.

Warum dieser Schritt erst jetzt möglich wird? Bislang lag das Know-how zur Radarsignalverarbeitung tief in den Blackboxen der Tier-1-Zulieferer vergraben. Sie bestimmten, wie ein Ziel aus dem FFT-Rauschen extrahiert wird. Mit der zentralen Architektur ziehen die Autobauer oder ihre beauftragten Chip-Spezialisten diese Kompetenz an sich. Technischer Treiber sind neue Chip-Generationen: NXP bietet mit dem Radar Bridge einen speziellen Bridge-Chip an, der MMIC- und SerDes-Funktion kombiniert; gleichzeitig integriert NXP Radar-Signalverarbeitungs-IP (RSP) direkt in die ADAS-SoC. Texas Instruments liefert mit der AWR-Serie Millimeterwellen-Radar-Chips, die bereits raw data ausgeben können. Das ermöglicht es, Algorithmen auf dem SoC selbst auszuführen, ohne auf die fertigen Filter der Radar-Hersteller angewiesen zu sein.

## Auswirkungen auf die Sensortechnik

Die Architektur-Reform betrifft alle drei relevanten Sensortypen unterschiedlich:

**Millimeterwellen-Radar:** Der Wettlauf um Auflösung und Kanäle verschärft sich. In China setzt man auf eine kosteneffiziente Bauweise mit 1 SoC + 2 MMIC (8T8R). Europäische Hersteller favorisieren 1 SoC + 4 MMIC (16T16R), langfristig sind 24T24R geplant. Die zentrale Architektur erlaubt es, die Algorithmik flexibler zu gestalten und von der höheren Datenmenge zu profitieren. Bis 2028 koexistieren beide Pfade mit völlig unterschiedlichen Kostenmodellen.

**Lidar:** Die Rohdaten-Fusion verändert die Kostenstruktur. Bisher nahm der FPGA zur Signalverarbeitung einen erheblichen Teil der Lidar-Kosten ein. Mit Verlagerung der Algorithmen in den Zentralrechner bleiben nur die optischen Komponenten (Laser, SPAD-Empfänger, TDC) im Sensor übrig. Die Datenrate ist enorm: Ein 192-Linien-Lidar mit 10 Hz, 120° horizontal, 0,1° Auflösung überträgt rund 3,6 Gbit/s – pro Sekunde ein Full-HD-Film. Das erfordert hochperformante GMSL-Schnittstellen und eine effiziente, slots-basierte Datenorganisation, die nicht mit dem Frame-basierten MIPI-Interface von Kameras identisch ist.

**Ultraschall-Sensor:** Die Umstellung ist vergleichsweise einfach. Die Laufzeitmessung liefert Rohdaten, die im Zentralrechner per feineren Korrelationsfiltern mehr Details extrahieren können. Huawei gibt für seine Lösung eine Zeitersparnis von ca. 20 % und eine Erhöhung der Punktdichte um den Faktor 10 an. Allerdings explodiert die Kabelanzahl: Typischerweise 12 Sensoren mit je eigenem SerDes-Kanal. Ein hybrides Konzept („teilverteilt + zentral") mit 6 Sensoren pro Pufferzone scheint praktikabel.

## Machtverschiebung in der Industrie

Die zentrale Sensorarchitektur ist mehr als ein technisches Detail: Sie markiert einen Machtwechsel. Bisher hielten Tier-1-Zulieferer wie Bosch oder Continental das Algorithmus-Know-how in ihren Radar-Blackboxen. Künftig wandert dieses Wissen zu den Autobauern oder zu Chip-Entwicklern, die die RSP-IP in ihre SoCs einbinden. Huawei zeigt mit seiner Lösung, wie ein chinesischer Technologiekonzern diese Lücke besetzt und gleichzeitig die Abhängigkeit von etablierten Zulieferern verringert. BYD (比亚迪) hat mit „Gottes Auge" ebenfalls ein eigenes System vorgestellt, das auf ähnliche Prinzipien setzt: Zeitersparnis 20 %, Reichweitensteigerung 20 %, Punktdichte +10 %. Die chinesische Industrie treibt die Entwicklung an, um die Datenpipeline vollständig zu kontrollieren – vom rohen Signal bis zur finalen Entscheidung. Für den europäischen Markt bedeutet das: Die nächste Generation der Fahrassistenzsysteme wird nicht mehr in deutschen Engineering-Zentren allein definiert, sondern in Shenzhen, Shanghai und Peking.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
