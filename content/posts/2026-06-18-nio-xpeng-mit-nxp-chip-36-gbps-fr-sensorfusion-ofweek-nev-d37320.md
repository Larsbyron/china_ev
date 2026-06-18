---
title: "NIO & XPeng mit NXP-Chip: 3,6 Gbps für Sensorfusion"
date: 2026-06-18T06:51:52.554Z
description: "NIO und XPeng setzen ab 2025 auf zentrale Rechnerarchitektur: Statt dezentraler Vorverarbeitung fließen rohe Sensordaten über NXP-Bridge-Chips in ein SoC. Erste Modelle wie NIO ET7 und XPeng G9 profitieren von präziserer Fusion."
source: "OFweek NEV"

category: "news"


tags: ["Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# NIO & XPeng mit NXP-Chip: 3,6 Gbps für Sensorfusion

Die chinesische Autoindustrie leitet einen fundamentalen Wandel der Sensorarchitektur ein. Statt Signale dezentral in den Sensoren vorzuverarbeiten, sollen künftig rohe Messdaten aller Radar-, Lidar- und Ultraschallsensoren über Hochgeschwindigkeitsverbindungen direkt in ein zentrales System-on-Chip (SoC) fließen. Dieser Paradigmenwechsel verschiebt sowohl die Wahrnehmungsqualität als auch die Machtverhältnisse in der Zulieferkette. Branchenexperten gehen davon aus, dass Modelle von NIO (蔚来) und XPeng (小鹏) ab 2025 auf diese Architektur setzen werden – konkert rechnen Analysten mit ersten Einsätzen im NIO ET7 und XPeng G9.

## So arbeitet die zentrale Architektur

Bisher arbeiteten Millimeterwellen-Radare weitgehend autark: Jeder Sensor führte selbst FFT, Zielerkennung und Doppler-Auswertung durch und meldete nur die finale Zielliste an das zentrale Steuergerät. Diese „verteilte Intelligenz" verarbeitet gefilterte Information – ein Teil der Rohdaten geht verloren. Bei der zentralen Architektur dagegen schicken die Sensoren unverarbeitete Rohsignale (z. B. das gesamte FFT-Spektrum) über SerDes-Verbindungen (Serializer/Deserializer) an ein leistungsstarkes SoC. Dort wird eine echtzeitfähige Sensorfusion betrieben, die Radardaten mit Lidar-Punktwolken kombiniert.

Das Ergebnis: Ein Ziel, das durch Wasserspritzer vom Radar verdeckt wird, kann vom Lidar dennoch erkannt werden – die Fusion gleicht Lücken aus. „Statt sich widersprechender Meldungen der Einzelsensoren liefert die zentrale Architektur eine konsistente Gesamtsicht", erklärt ein Entwicklungspartner.

## OEMs übernehmen die Sensor-Intelligenz

Bislang hielten Tier-1-Zulieferer die entscheidende Signalverarbeitungs-Software unter Verschluss. Sie lieferten „Blackboxen" – der Autobauer bekam nur die fertige Objektliste, nicht die Rohdaten. Mit der zentralen Architektur wandern diese Algorithmen auf das SoC im Fahrzeug. NXP (NXP Semiconductors) hat spezielle Radar-Bridge-Chips entwickelt, die den Datenstrom vom Radar-MMIC über SerDes ins SoC leiten. Gleichzeitig integriert NXP Radar-Signalverarbeitungs-IP (RSP IP) direkt in seine ADAS-SoCs, sodass Autobauer auf standardisierte Algorithmen zugreifen können. Auch Texas Instruments (TI) verfolgt eine ähnliche Route: Seine AWR-Serie von Millimeterwellen-Radar-Chips unterstützt bereits die Rohdatenausgabe.

Für die Stufe 3 und 4 des autonomen Fahrens (SAE-Klassifikation) reichen fragmentierte Ziellisten nicht mehr aus. Gefragt sind rohe Doppler- und Amplitudeninformationen, um bewegte Objekte von stehenden Hindernissen wie Mülltonnen oder Baumstämmen unterscheiden zu können. Bisher wäre die Verarbeitung von 12 Radar-Signalen in einem einzigen SoC eine enorme Belastung gewesen – mit den neuen Chips ist das nun machbar.

## Hürden: Bandbreite, Datenstruktur und Timing

Trotz der Vorteile stehen Ingenieure vor technischen Herausforderungen. Die Übertragung von rohen Lidar-Daten beispielsweise erfordert immense Bandbreiten: Ein 192-Linien-Lidar mit 10 Hz Bildwiederholrate, 120° horizontalem Sichtfeld und 0,1° Auflösung erzeugt pro Sekunde bis zu **3,6 Gbps** Rohdaten. Zwar reicht GMSL2 (6 Gbps) theoretisch aus, doch die Timing-Anforderungen sind hoch – eine einzige verspätete Übertragung kann die gesamte Fusion gefährden.

Auch die Datenstruktur macht Probleme: Kameras liefern Frame-basierte Bilder, die für eine ISP-Pipeline optimiert sind. Lidar-Daten hingegen sind als Slots organisiert (z. B. 1200 Slots pro Frame), jeder mit Entfernung, Intensität, Doppler- und Rauschinformationen. „Es ist kein triviales Problem, die Daten so umzuformatieren, dass DSPs oder KI-Beschleuniger effizient darauf zugreifen können", räumt ein Systemarchitekt ein.

Ultraschallsensoren dagegen sind einfacher zu integrieren: Ihre Signalverarbeitung (Laufzeitmessung) ist weniger komplex, und die zentrale Verarbeitung kann durch feinere Matching-Filter mehr Informationen aus den Rohdaten extrahieren. Allerdings steigt der Verdrahtungsaufwand – bei 12 Sensoren wären 12 separate SerDes-Verbindungen nötig. Ein Kompromiss ist die hybride „regionale Vorverarbeitung mit zentraler Fusion", wie sie etwa BYD (比亚迪) bei seinen Modellen einsetzt: Sechs verbundene Einheiten reduzieren Verkabelung, ohne die Vorteile der Zentralisierung komplett zu opfern.

## Fazit: Die Datenpipeline wird neu definiert

Die chinesische Automobilindustrie arbeitet an einer vollständig transparenten Datenpipeline: Vom rohen Sensor-Signal bis zur endgültigen Entscheidung gibt es keine Blackbox mehr. Je mehr Daten die Algorithmen erhalten, desto besser können sie die Umgebung verstehen. Sobald die Hersteller diese Architektur beherrschen, werden sie in der Lage sein, L2-Systeme (teilautonom) gezielt auf L3 (bedingt autonom) weiterzuentwickeln. NIO und XPeng gehen dabei als Vorreiter voran.

---

**Marktstatus in Deutschland:** NIO (mit Modellen wie ET7, ET5, EL6) und XPeng (mit G9, P7) sind bereits in Deutschland erhältlich. Die hier beschriebene zentrale Rechnerarchitektur wird ab 2025 erwartet – sie könnte dann auch in den für Europa bestimmten Fahrzeugen Einzug halten.
