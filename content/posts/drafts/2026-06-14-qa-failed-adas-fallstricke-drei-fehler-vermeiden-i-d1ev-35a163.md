---
title: "[QA FAILED] ADAS-Fallstricke: Drei Fehler vermeiden im Stadtverkehr"
date: 2026-06-14T11:53:02.165Z
description: "Eine Analyse aus dem chinesischen NOA-Wettbewerb zeigt typische Systemfehler: Spurverstöße, falsche Fahrspur und Rotlicht-Verstöße. Der Leitfaden hilft, Risiken zu erkennen und rechtzeitig zu übernehmen."
source: "D1EV"
image: "/images/qa-failed-adas-fallstricke-drei-fehler-vermeiden-i-d1ev-35a163.webp"
category: "news"


tags: ["Autopilot", "Sicherheit"]
draft: true
original_url: "https://www.d1ev.com/news/qiye/302945"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] ADAS-Fallstricke: Drei Fehler vermeiden im Stadtverkehr

Fahrassistenzsysteme (ADAS) wie der Stadtpilot (NOA) werden immer leistungsfähiger – doch sie sind nicht fehlerfrei. Im Rahmen des „2. Nationalen ADAS-Wettbewerbs – Stadt-NOA-Challenge“ in Hefei (Anhui) wurden die häufigsten Regelverstöße dokumentiert. Dieser Leitfaden zeigt die drei typischen Fallstricke und gibt konkrete Handlungsempfehlungen.

## Fallstrick 1: Dauerhaftes Überfahren der Fahrbahnmarkierung

**Szenario:** Das System will einem langsamen Lieferwagen ausweichen, leitet einen Spurwechsel ein – doch es setzt zu früh an, überfährt durchgehend beide Fahrstreifenbegrenzungen und wirkt unsicher in der Spurführung.

**Technischer Hintergrund:** Die Ursache liegt oft in einer zu aggressiven Pfadplanung: Um die Spur frühzeitig zu wechseln oder einen Hindernis zu umfahren, wird die Querbewegung zu früh eingeleitet. Gleichzeitig mangelt es an präziser Querregelung, sodass das Fahrzeug nicht stabil in der Spurmitte bleibt. Wiederholtes Markierungsüberfahren deutet auf einen Algorithmus-Konflikt hin.

**Risiken:** In der Nähe von Lkw entsteht schnell der tote Winkel. Bei gleichzeitigem Spurwechsel des Lkw droht eine Kollision. Zudem sind durchgezogene Linien kurz vor Kreuzungen verboten und gefährden den Seitenverkehr.

**Handlungsempfehlung:** Übernehmen Sie sofort, wenn Sie unter Brücken, an komplexen Kreuzungen oder nahe an großen Fahrzeugen sind. Achten Sie auf Frühwarnsignale wie verfrühten Spurwechsel oder unstetes Lenken.

## Fallstrick 2: Einordnen in die falsche Abbiegespur

**Szenario:** Das System wechselt auf der linken Spur und landet in einer Linksabbiegerspur. Der Beifahrer erkennt über das Navi, dass eigentlich geradeaus weitergefahren werden sollte. Der Fahrer übernimmt manuell.

**Technischer Hintergrund:** Hier liegt eine Diskrepanz zwischen spurgensauer Navigation (z. B. HD-Karte) und der Situationserkennung vor. Das System interpretiert die Fahrabsicht falsch (Linksabbiegen statt Geradeaus) oder ordnet die Spur falsch zu.

**Risiken:** Wenn das Fahrzeug in die falsche Spur einfährt und später wieder ausschert, droht ein Verstoß gegen durchgezogene Linien. Bei dichtem Verkehr kommt es leicht zu Seitencrashs.

**Handlungsempfehlung:** Wenn das System weit vor der Kreuzung oder bei dichtem Verkehr plötzlich die Spur wechselt, prüfen Sie sofort die Absicht. Bei sichtbarem Navigationsfehler übernehmen Sie ohne Zögern – warten Sie nicht auf eine Systemkorrektur.

## Fallstrick 3: Rotlichtverstoß

**Szenario A:** Das Fahrzeug hält an einer roten Ampel an, setzt sich dann aber wieder in Bewegung. Der Beifahrer ruft „Stopp, stopp!“ – der Fahrer übernimmt und bremst.

**Szenario B:** An einer stark befahrenen Kreuzung fährt das System weiter, obwohl die Ampel rot ist. Erst als ein entgegenkommendes Auto fast kollidiert, greift der Fahrer ein und bremst scharf.

**Technischer Hintergrund:** Im Fall A könnte die Sensorik die Ampel kurzzeitig verlieren oder ein Konflikt zwischen Karte und Realsignal auftreten. Im Fall B erkennt das System die rote Ampel und den Querverkehr, schätzt jedoch fälschlicherweise, dass ein „Durchschlüpfen“ möglich ist – die Fahrerüberwachung warnt nicht rechtzeitig.

**Risiken:** Direkte Kollision mit dem Querverkehr, Auffahrunfall durch Notbremsung auf der Kreuzung, Gefahr für Fußgänger.

**Handlungsempfehlung:** Sobald das Fahrzeug nach einem Halt an der roten Ampel wieder anrollt, sofort selbst feste bremsen. Wenn Sie bereits über die Haltelinie gerollt sind, stehen bleiben, nicht zurücksetzen, bei Grün normal weiterfahren.

## Bonus: Zu hohes Tempo in Baustellen

**Szenario:** In einer Baustelle ohne Markierungen fährt das System mit hohem Tempo und streift fast ein entgegenkommendes Fahrzeug. Die Insassen sind erschrocken.

**Risiko:** In unstrukturierten Bereichen fehlen klare Fahrbahnbegrenzungen. Das System plant den Pfad unzureichend, reagiert zu spät auf Gegenverkehr – der Reaktionszeitraum für den Fahrer ist extrem kurz.

**Handlungsempfehlung:** Sobald Sie in einer Baustelle Tempo und Fahrbahn als unsicher empfinden, sofort bremsen und übernehmen. Der „Freie Pfad“-Modus ist kein Autopilot für chaotische Umgebungen.

## Fazit: Mensch-Maschine-Kooperation erfordert Achtsamkeit

Fahrassistenzsysteme sind Helfer, keine Fahrer. In komplexen Situationen – Kreuzungen, Lkw-Nähe, Ampel-Erkennung, Baustellen – zeigen sich noch deutliche Lücken. Die analysierten Fehler sind keine Einzelfälle, sondern Folgen von Systementscheidungen, die mit echten Verkehrsregeln und Fahrerabsichten kollidieren. Behalten Sie stets die Kontrolle, erkennen Sie Frühsignale (verfrühter Spurwechsel, wiederholtes Markierungsüberfahren, Rollen an der roten Ampel) und übernehmen Sie rechtzeitig. Nur so bleibt die Technik ein Sicherheitsgewinn.

*Quelle: D1EV.com – basierend auf dem 2. Nationalen ADAS-Wettbewerb in Hefei.*

---

Dieser Sicherheitsleitfaden basiert auf Tests chinesischer Hersteller. Die beschriebenen ADAS-Fehler sind generischer Natur und können bei verschiedenen Systemen auftreten – auch bei in Europa erhältlichen Modellen. Eine spezifische Fahrzeugmarke wird nicht genannt.
