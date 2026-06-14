---
title: "[QA FAILED] Chinesische Fahrassistenz: Drei klassische Risikoszenarien"
date: 2026-06-14T06:33:25.928Z
description: "Ein Real-Test des City-Navigationspiloten in China zeigt typische Systemgrenzen: Spurverlassen, falsche Spurwahl und Rotlichtverstöße. Die Analyse hilft Fahrern, risikoreiche Situationen rechtzeitig zu erkennen und richtig zu reagieren."
source: "D1EV"
image: "/images/qa-failed-chinesische-fahrassistenz-drei-klassisch-d1ev-945e32.webp"
category: "news"


tags: ["Sicherheit"]
draft: true
original_url: "https://www.d1ev.com/news/qiye/302945"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Chinesische Fahrassistenz: Drei klassische Risikoszenarien

Fahrassistenzsysteme verbreiten sich rasant – von der Autobahn bis in die City. Doch sie sind nicht perfekt. In komplexen Verkehrssituationen können sie durch eingeschränkte Sensorik, fehlerhafte Entscheidungen oder unzureichende Kontrolle gefährliche und sogar regelwidrige Manöver ausführen.

Das chinesische Automobilportal D1EV hat auf Basis der zweiten „City-Navigationspilot-Herausforderung“ in Hefei die drei häufigsten und folgenschwersten Regelverstöße von Assistenzsystemen im realen Straßenverkehr identifiziert: Überfahren durchgezogener Linien, falsche Spurwahl und Rotlichtverstöße. Die Analyse bietet konkrete Handlungsempfehlungen für eine sichere Mensch-Maschine-Kooperation.

## Spurverlassen: Gefährliche Annäherung an Lkw

In einem getesteten Szenario führt das System bei Annäherung an einen vorausfahrenden großen Lkw einen Linkswechsel durch – allerdings zu früh, mit mehrfachem Linienüberfahren und zögerlicher Lenkbewegung. Technisch liegt dies entweder an einer zu aggressiven Routenplanung (frühzeitiges Ausweichen) oder an ungenauer Querregelung. Das ständige Überfahren der Fahrbahnmarkierungen deutet auf einen Entscheidungskonflikt hin. Gerade in Lkw-Nähe ist das besonders riskant: Der Pkw gerät in den toten Winkel, bei gleichzeitigem Spurwechsel des Lkws droht ein schwerer Unfall. Zudem ist das Überfahren durchgezogener Linien am Kreuzungsbereich nicht nur ordnungswidrig, sondern kann auch den seitlichen Verkehr gefährden.

**Empfehlung:** Bei Brückenunterführungen, komplexen Kreuzungen oder in Lkw-Nähe sollte der Fahrer die Kontrolle übernehmen, sobald das System zu früh oder zögerlich die Spur wechselt. Das ist ein klares Warnsignal.

## Falsche Spur: System wählt Linksabbieger, obwohl geradeaus gewünscht

In einem weiteren Test wechselt das Fahrzeug selbstständig auf die Linksabbiegerspur, obwohl die Navigation geradewegs vorgibt. Der Beifahrer erkennt den Fehler auf dem Smartphone, der Fahrer übernimmt manuell. Ursache ist eine fehlerhafte Kopplung zwischen spurgenauer Navigation und Situationserkennung: Das System interpretiert die Fahrspur falsch oder leitet aus der Verkehrssituation fälschlicherweise einen Linksabbiegewunsch ab. Wenn der Fahrer nicht rechtzeitig eingreift, riskiert er entweder einen Rotlichtverstoß (weil er dennoch geradeaus fährt) oder überfährt die durchgezogene Linie, um zurückzuwechseln – beides ist ordnungswidrig und unfallträchtig.

**Empfehlung:** Wenn das Assistenzsystem bei dichtem Verkehr oder weit vor der Kreuzung plötzlich die Spur wechseln will, sollte der Fahrer blitzschnell prüfen, ob dies sinnvoll ist. Bei Abweichung vom Routenziel sofort manuell übernehmen und nicht auf eine automatische Korrektur warten.

## Rotlichtverstoß: System hält kurz an, rollt dann weiter

Gleich zwei Varianten wurden dokumentiert: Im ersten Fall hält das Auto an der roten Ampel, setzt sich dann aber wieder in Bewegung – der Beifahrer ruft „Stopp!“, der Fahrer übernimmt und bremst. Mögliche Ursachen: kurzzeitiger Sensorausfall, Konflikt zwischen Karten- und Signaldaten oder ein „Kriechmodus“ nach Assistenz-Deaktivierung. Im zweiten Fall erkennt das System das Rotlicht und den Querverkehr, entscheidet aber fälschlicherweise „durchfahren“ und setzt die Fahrt fort. Erst ein entgegenkommendes Auto zwingt den Fahrer zur Notbremsung. Der Fahrerüberwachungssensor hatte nicht eingegriffen.

**Risiko:** Direkte Kollision mit dem Querverkehr, Auffahrunfälle durch Vollbremsung auf der Kreuzung, Gefährdung von Fußgängern.

**Empfehlung:** Sobald das Fahrzeug an der roten Ampel nach dem Anhalten wieder anrollt, sofort kräftig bremsen – nicht auf eine Systemkorrektur warten. Bei Überfahren der Haltelinie anhalten und auf Grün warten, auf keinen Fall zurücksetzen.

## Bonus: Gefährliche Überhöhung der Geschwindigkeit auf Baustellen

Ein weiteres beobachtetes Risiko: Das System wählt auf einer Baustelle eine zu hohe Geschwindigkeit bei der freien Routensuche (keine Fahrbahnmarkierungen). Ein entgegenkommendes Fahrzeug streift fast die eigene Karosserie – Beifahrer und Fahrer sind sichtlich erschrocken. In unstrukturierten Bereichen fehlt dem System die nötige Planungssicherheit; der Reaktionsspielraum für den Fahrer wird kritisch verkürzt.

**Empfehlung:** Sobald sich die Geschwindigkeit auf einer Baustelle unsicher anfühlt, sofort bremsen und selbst lenken.

## Fazit: Assistenzsysteme sind Helfer, keine autonomen Fahrer

Die Analyse zeigt, dass die meisten gefährlichen Situationen nicht auf einen Einzelfehler zurückgehen, sondern auf ein Missverhältnis zwischen Systemlogik und realem Verkehr. Fahrer müssen wachsam bleiben, Frühwarnsignale (zu frühe Spurwechsel, mehrfaches Linienüberfahren, erneutes Anrollen an roter Ampel) erkennen und rechtzeitig eingreifen. Nur ein korrektes Verständnis der Mensch-Maschine-Kooperation ermöglicht die sichere Nutzung moderner Assistenzsysteme.

---

Dieser Artikel bezieht sich auf Tests von City-Navigationspiloten in China. Die beschriebenen Systeme (vergleichbar mit Tesla FSD oder Mercedes Drive Pilot) sind in Europa teilweise verfügbar, die spezifischen Risikoszenarien gelten jedoch primär für chinesische Verkehrsbedingungen. Deutsche Fahrer sollten die Hinweise als allgemeine Sicherheitsempfehlung für assistierte Fahrsituationen verstehen.
