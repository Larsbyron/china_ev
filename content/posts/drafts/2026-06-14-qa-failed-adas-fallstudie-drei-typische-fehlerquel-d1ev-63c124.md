---
title: "[QA FAILED] ADAS-Fallstudie: Drei typische Fehlerquellen beim autonomen Fahren"
date: 2026-06-14T19:18:20.091Z
description: "Ein chinesischer Praxis-Test zeigt: Selbst moderne Fahrassistenzsysteme kreuzen Linien, verpassen Abbiegespuren oder ignorieren rote Ampeln. Die Analyse liefert konkrete Tipps für sicheres Eingreifen."
source: "D1EV"
image: "/images/qa-failed-adas-fallstudie-drei-typische-fehlerquel-d1ev-63c124.webp"
category: "news"


tags: ["Autopilot", "Sicherheit"]
draft: true
original_url: "https://www.d1ev.com/news/qiye/302945"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] ADAS-Fallstudie: Drei typische Fehlerquellen beim autonomen Fahren

**Hintergrund: Wie zuverlässig sind City-NOA?**  
Der chinesische Branchentest „Second Autonomous Driving Competition – City-NOA Challenge (Hefei-Station)“ hat alltägliche Schwachstellen aktueller Fahrassistenzsysteme (ADAS) offengelegt. Getestet wurden Fahrzeuge mit City-NOA – dem chinesischen Pendant zu Teslas Full Self-Driving (FSD) im Stadtverkehr. Drei Fehlertypen traten am häufigsten auf: dauerhaftes Linienüberfahren, falsche Spurwahl und Rotlichtverstöße.

## Fehler 1: Dauerhaftes Linienüberfahren  
**Szenario:** Das System weicht einem vorausfahrenden Lastwagen aus – und beginnt zu früh den Spurwechsel. Die Folge: Der Wagen überfährt mehrfach die Fahrbahnmarkierung, die Flugbahn wirkt unsicher.  
**Technische Ursache:** Entweder ist die Trajektorienplanung zu aggressiv (frühes Ausweichen) oder die Querregelung unzureichend – das Fahrzeug pendelt zwischen den Spuren. Bei dichtem Verkehr oder in der Nähe von Lkw-Blinkern drohen Auffahrunfälle oder das Übersehen von Radfahrern im toten Winkel.  
**Vermeidungstipp:** Nähert sich das Auto einer großen Kreuzung, einer Brücke oder einem Lkw, sofort die Kontrolle übernehmen. Achten Sie auf Anzeichen wie „zu früher Spurwechsel“ oder „Linienflattern“.

## Fehler 2: Falsche Abbiegespur  
**Szenario:** Das Assistenzsystem wechselt eigenständig auf die Linksabbiegerspur, obwohl die Route geradeaus vorsieht. Der Fahrer bemerkt die Abweichung erst auf dem Navigationsbildschirm.  
**Technische Ursache:** Eine Fehlkopplung zwischen spurgenauer Navigation und Umfelderkennung. Entweder wurde die Fahrspur falsch klassifiziert (Linksabbiegespur statt Geradeausspur) oder die Routenlogik wich vom Fahrerwunsch ab.  
**Vermeidungstipp:** Wenn das System bei dichtem Verkehr oder noch weit vor der Kreuzung plötzlich einen Spurwechsel einleitet, prüfen Sie sofort die Absicht. Bei Unsicherheit: selbst eingreifen, nicht auf Systemkorrektur warten.

## Fehler 3: Rotlichtverstoß  
**Szenario 1:** Das Auto hält an der roten Ampel an, setzt dann aber wieder an – der Beifahrer ruft „Stopp!“. Der Fahrer bremst manuell.  
**Szenario 2:** Das Auto nähert sich einer stark befahrenen roten Ampel, der Fahrer wartet nicht. Erst als ein entgegenkommendes Fahrzeug fast kollidiert, greift er ein.  
**Technische Ursache:** Entweder ein kurzzeitiger Sensordatenausfall oder ein Konflikt zwischen Karte und Ampelstatus. Oder das System bewertet die Situation fälschlicherweise als „freie Fahrt“ (Kriechmodus), obwohl Rot gilt.  
**Vermeidungstipp:** Sobald das Fahrzeug an der Ampel nach dem Stillstand wieder anrollt, sofort und kräftig bremsen. Wenn Sie bereits über die Haltelinie gerollt sind: stehen bleiben, nicht zurücksetzen.

## Sonderfall: Baustelle mit zu hohem Tempo  
Im Test führte eine Baustelle mit freier Spurwahl zu einer gefährlichen Begegnung mit dem Gegenverkehr. Die Geschwindigkeit war zu hoch, die Reaktionszeit zu kurz.  
**Tipp:** Auf Baustellen immer manuell fahren – das System erkennt unstrukturierte Fahrbahnen oft nicht rechtzeitig.

**Fazit:** Fahrassistenzsysteme sind Helfer, keine Fahrer. Besonders an komplexen Kreuzungen, neben Lkw oder bei Ampeln sind kritische Situationen programmiert. Wer die Warnsignale (frühe Spurwechsel, Linienüberfahren, Wiedeanfahren an Rot) kennt, kann rechtzeitig eingreifen.

---

Die beschriebenen Fahrassistenzsysteme sind in Europa ebenfalls verbreitet, etwa als Stufe-2-Systeme (z. B. Tesla Autopilot, Mercedes Drive Pilot). In Deutschland gelten strengere Zulassungsvorschriften – doch die grundlegenden Risiken sind vergleichbar.
