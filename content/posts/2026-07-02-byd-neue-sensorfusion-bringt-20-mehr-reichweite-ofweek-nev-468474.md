---
title: "BYD: Neue Sensorfusion bringt 20 % mehr Reichweite"
date: 2026-07-02T19:17:04.253Z
description: "BYD rüstet seine E-Autos mit einer zentralen Front-Fusion aus. Die neue Architektur steigert die Reichweite der Ultraschallsensoren um 20 Prozent und die Datenverarbeitung um das Zehnfache – ein konkreter Fortschritt für Fahrerassistenz."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# BYD: Neue Sensorfusion bringt 20 % mehr Reichweite

BYD (比亚迪) setzt bei seinen aktuellen Elektromodellen auf eine neuartige Architektur für Fahrerassistenzsysteme. Statt Sensoren wie Radar, Lidar oder Ultraschall mit eigenen Mikrocontrollern auszustatten, die vorverarbeitete Daten liefern, werden nun die rohen, ungefilterten Signale direkt an einen zentralen Rechenchip gesendet. Das Unternehmen gab bekannt, dass dieser Ansatz die Reichweite der Ultraschallsensoren um 20 Prozent erhöht, die Taktfrequenz um 20 Prozent anhebt und die Datendichte um den Faktor 10 steigert. Damit verbessert sich vor allem die Hinderniserkennung im Nahbereich, etwa beim Einparken oder im Stadtverkehr.

### Von isolierten Sensoren zur zentralen Rohdatenfusion

Bisher arbeiteten Sensoren weitgehend autonom: Ein Radarsensor meldete „50 Meter voraus Hindernis“, ein anderer „30 Meter rechts stehendes Objekt“. Der Fusionsrechner erhielt bereits verdichtete Listen, bei denen Informationen durch Vorverarbeitung verloren gingen. Der neue Ansatz – in der Branche als Front-Fusion (前融合) bekannt – speist dagegen die rohen Signale aller Sensoren in einen einzigen Algorithmus ein. Ein Beispiel: Regentropfen stören die Punktewolke eines Lidars, während das Radar durch die Feuchtigkeit kaum beeinträchtigt wird. In der alten Architektur entstünde ein Widerspruch („kein Hindernis“ vs. „Hindernis“). Die Front-Fusion kombiniert beide Rohdatensätze zu einer präzisen Umfeldwahrnehmung – nach Branchenaussage kann „1 plus 1 dann 5 ergeben“.

### Algorithmen-Kontrolle verlässt die Zulieferer

Bislang lag das Kern-Know-how der Radarsignalverarbeitung – etwa die Zielverfolgung oder die Doppler-Auswertung – tief in der Firmware der Sensor-Hardware, geschützt von Tier-1-Zulieferern wie Bosch, Continental oder Hella. Die neue Architektur entkoppelt die Algorithmen von der Sensor-Einheit. Chip-Hersteller wie NXP oder Texas Instruments (TI) liefern künftig nur noch reine Transceiver (MMIC) und rudimentäre Vorprozessoren. Die eigentliche Verarbeitung – Fast-Fourier-Transformation (FFT), Constant False Alarm Rate (CFAR), Zielverfolgung – übernimmt der zentrale ADAS-SoC im Fahrzeug. NXP hat dazu eine spezielle „Radar Bridge“ vorgestellt, TI bietet mit seiner AWR-Reihe Rohdaten-Schnittstellen an.

Für höhere Automatisierungsstufen (L3/L4) reichen abstrahierte Ziellisten nicht mehr aus: Zur Erkennung von toten Winkeln, querenden Fahrrädern oder herabgefallenen Steinen sind die rohen Phasen- und Amplitudenverläufe nötig. Die Umstellung ist technisch anspruchsvoll, da die SoCs nun 12 oder mehr Radar-Kanäle gleichzeitig per FFT und CFAR verarbeiten müssen – eine enorme Rechenlast.

### Ultraschall: BYD bringt konkrete Verbesserungen

BYD zeigt an seinem Ultraschall-Radar-System, was die Front-Fusion leistet. Durch die Verlagerung der Signalverarbeitung auf den zentralen SoC steigt die Taktfrequenz um 20 Prozent, die Erkennungsdistanz wächst um 20 Prozent und die Datendichte verzehnfacht sich. Das erlaubt feinere Korrelationsfilter-Algorithmen, die mehr Informationen aus den Reflektionen extrahieren. BYD selbst spricht von einem „halben Schritt zwischen Vollfusion und lokaler Vorverarbeitung“. Konkrete Modellnamen, in denen das System bereits verbaut ist, nannte das Unternehmen bislang nicht – Insider gehen aber von der Han- und Seal-Baureihe aus.

### Ausblick

Die chinesische Automobilindustrie treibt den Wandel hin zu einer zentralen Sensorfusion voran, bei der Algorithmen die volle Kontrolle über die Rohdaten erhalten. Dies ermöglicht nicht nur präzisere Assistenzfunktionen, sondern legt auch die Grundlage für den Übergang zu höheren Autonomiestufen. Ob andere Hersteller ähnliche Wege einschlagen oder auf abgestufte Hybrid-Lösungen setzen, wird sich in den kommenden Jahren zeigen.

---

BYD ist in Deutschland mit mehreren Modellen (z. B. Han, Seal, Atto 3) erhältlich. Ob die neue Front-Fusion-Architektur auch in den für Europa bestimmten Fahrzeugen zum Einsatz kommt, hat der Hersteller noch nicht bestätigt. Da die Technik tief in der Software- und Hardware-Architektur verankert ist, dürfte eine Einführung mit einer Modellpflege oder neuen Plattform einhergehen.
