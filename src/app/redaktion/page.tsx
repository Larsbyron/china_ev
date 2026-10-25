import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { AUTHOR } from '@/lib/author'
import { SITE_URL, canonicalUrl } from '@/lib/site'
import {
  AI_LABEL,
  EDITORIAL_RESPONSIBLE,
  PUBLISHER,
  REDAKTION_STAND,
  SOURCES,
} from '@/lib/redaktion'
import styles from './redaktion.module.css'

const PAGE_PATH = '/redaktion/'

export const metadata: Metadata = {
  title: 'Redaktion & Transparenz',
  description:
    'Wer E-AUTOS verantwortet, wie unsere Artikel entstehen, wie wir KI einsetzen, wie wir Fehler korrigieren und wie wir uns finanzieren.',
  alternates: {
    canonical: canonicalUrl(PAGE_PATH),
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl(PAGE_PATH),
    siteName: 'E-AUTOS',
    locale: 'de_DE',
    title: 'Redaktion & Transparenz',
    description:
      'Arbeitsweise, KI-Kennzeichnung, Qualitätssicherung, Korrekturen und Finanzierung bei E-AUTOS.',
  },
}

export default function RedaktionPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Redaktion und Transparenz">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AboutPage',
              name: 'Redaktion & Transparenz',
              url: canonicalUrl(PAGE_PATH),
              inLanguage: 'de-DE',
              isPartOf: { '@type': 'WebSite', name: 'E-AUTOS', url: SITE_URL },
              mainEntity: {
                '@type': 'NewsMediaOrganization',
                name: 'E-AUTOS',
                url: SITE_URL,
                publishingPrinciples: canonicalUrl(PAGE_PATH),
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Redaktion',
                  email: PUBLISHER.email,
                  telephone: PUBLISHER.phone,
                  availableLanguage: ['de'],
                },
                parentOrganization: {
                  '@type': 'Organization',
                  name: PUBLISHER.legalName,
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: PUBLISHER.street,
                    postalCode: PUBLISHER.postalCode,
                    addressLocality: PUBLISHER.city,
                    addressCountry: 'DE',
                  },
                },
              },
            }),
          }}
        />

        <p className={styles.eyebrow}>Transparenz</p>
        <h1 className={styles.title}>Redaktion &amp; Transparenz</h1>

        <p className={styles.lead}>
          E-AUTOS ist ein deutschsprachiges Online-Magazin über Elektroautos aus
          China. Auf dieser Seite steht, wer das Angebot verantwortet, wie unsere
          Artikel entstehen, wie viel davon automatisiert ist – und wie wir uns
          finanzieren.
        </p>

        <nav className={styles.toc} aria-label="Inhalt dieser Seite">
          <span className={styles.tocTitle}>Auf dieser Seite</span>
          <ul className={styles.tocList}>
            <li><a className={styles.tocLink} href="#wer-wir-sind">Wer wir sind</a></li>
            <li><a className={styles.tocLink} href="#wie-wir-arbeiten">Wie wir arbeiten</a></li>
            <li><a className={styles.tocLink} href="#ki">Kennzeichnung von KI-Unterstützung</a></li>
            <li><a className={styles.tocLink} href="#qualitaet">Qualitätssicherung</a></li>
            <li><a className={styles.tocLink} href="#korrekturen">Korrekturen &amp; Kontakt</a></li>
            <li><a className={styles.tocLink} href="#verantwortung">Redaktionelle Verantwortung</a></li>
            <li><a className={styles.tocLink} href="#autoren">Autoren</a></li>
            <li><a className={styles.tocLink} href="#finanzierung">Finanzierung &amp; Werbung</a></li>
            <li><a className={styles.tocLink} href="#datenschutz">Datenschutz</a></li>
          </ul>
        </nav>

        <section className={styles.section} id="wer-wir-sind">
          <h2 className={styles.h2}>Wer wir sind</h2>
          <p className={styles.p}>
            E-AUTOS wird von der {PUBLISHER.legalName} mit Sitz in {PUBLISHER.city}{' '}
            betrieben. Die vollständigen Anbieterangaben nach § 5 DDG stehen im{' '}
            <Link className={styles.link} href="/impressum/">Impressum</Link>.
          </p>
          <p className={styles.p}>
            Wir berichten über chinesische Elektroautos: Marktstarts, Preise,
            Reichweiten, Batterie- und Ladetechnik, Absatzzahlen – und darüber, welche
            dieser Modelle nach Deutschland und Europa kommen. Der Schwerpunkt liegt
            auf der Frage, was eine Meldung aus Shenzhen, Peking oder Shanghai für
            Käuferinnen und Käufer hierzulande bedeutet.
          </p>
          <p className={styles.p}>
            Wir sind ein kleines, digital arbeitendes Medium. Es gibt kein
            Auslandsbüro und kein Reporterteam in China: Unsere Informationen stammen
            aus öffentlich zugänglichen Fachmedien, Herstellerangaben und
            Behördenveröffentlichungen. Diese Quellen werten wir täglich aus,
            übertragen die Inhalte ins Deutsche und ordnen sie ein. Was wir dabei
            nicht tun, steht im nächsten Abschnitt – offen und ohne Kleingedrucktes.
          </p>
          <p className={styles.p}>
            Seit dem Start sind mehr als 3.200 Artikel erschienen. Diese Menge ist
            ohne Automatisierung nicht zu bewältigen. Deshalb beschreiben wir im
            Folgenden genau, welcher Teil der Arbeit maschinell ist und welcher nicht.
          </p>
        </section>

        <section className={styles.section} id="wie-wir-arbeiten">
          <h2 className={styles.h2}>Wie wir arbeiten</h2>

          <h3 className={styles.h3}>Quellen</h3>
          <p className={styles.p}>
            Wir werten unter anderem diese Fachmedien aus:
          </p>
          <ul className={styles.list}>
            {SOURCES.map((source) => (
              <li key={source} className={styles.listItem}>{source}</li>
            ))}
          </ul>
          <p className={styles.p}>
            Jeder Artikel nennt seine Quelle und verlinkt – außer bei eigenen
            Ratgebern – auf den Originalbeitrag. Eigene Ratgeber haben keine fremde
            Vorlage; sie tragen die Quellenangabe „E-AUTOS Redaktion“.
          </p>

          <h3 className={styles.h3}>Übersetzung</h3>
          <p className={styles.p}>
            Die Erstübersetzung eines Fachbeitrags entsteht mit einem KI-Sprachmodell.
            Es handelt sich um eine Übertragung, nicht um eine eigene Recherche:
            Zahlen und Zitate stammen aus der Quelle. Ergänzt wird ein kurzer,
            ebenfalls KI-generierter Abschnitt „In Deutschland“, der die
            Marktbedeutung einordnet – auch er ist keine eigene Recherche. Wir fügen
            keine Beträge, Reichweiten oder Leistungsdaten hinzu, die im Original
            nicht stehen.
          </p>
          <p className={styles.p}>
            Originaltexte sind in der Regel englisch oder chinesisch. Beim Übertragen
            gehen Nuancen verloren; genau deshalb ist die Quelle an jedem Artikel
            verlinkt. Wenn Ihnen eine Stelle falsch übersetzt erscheint, schreiben Sie
            uns – siehe <a className={styles.link} href="#korrekturen">Korrekturen &amp; Kontakt</a>.
          </p>

          <h3 className={styles.h3}>Automatisierte Prüfung</h3>
          <p className={styles.p}>
            Vor der Veröffentlichung läuft jeder übersetzte Text durch eine
            automatisierte Qualitätsprüfung (fest definierte Regeln) und eine
            ebenfalls automatisierte redaktionelle Bewertung durch ein Sprachmodell.
            Geprüft werden unter anderem:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              Sprachqualität: keine chinesischen Schriftzeichen, keine
              Übersetzungsreste, keine Platzhalter im deutschen Text
            </li>
            <li className={styles.listItem}>
              Markenname: der Markenname aus der Quelle muss im deutschen Text
              vorkommen
            </li>
            <li className={styles.listItem}>
              Preise: Yuan-Betrag und Euro-Umrechnung mit festem Richtkurs
            </li>
            <li className={styles.listItem}>
              Reichweiten nur mit dem zugehörigen Prüfzyklus (CLTC oder WLTP)
            </li>
            <li className={styles.listItem}>
              Länge von Titel, Beschreibung und Text im Verhältnis zum Original
            </li>
            <li className={styles.listItem}>
              Vollständigkeit: der Abschnitt „In Deutschland“ muss vorhanden sein
            </li>
          </ul>
          <p className={styles.p}>
            Erfüllt ein Text diese Kriterien nicht, wird er neu übersetzt; andernfalls
            erscheint er nicht. Diese Prüfung ist gründlich, aber sie ist keine
            Recherche vor Ort: Wir führen keine Interviews, besuchen keine Messen und
            machen keine eigenen Fahrversuche.
          </p>
        </section>

        <section className={styles.section} id="ki">
          <h2 className={styles.h2}>Kennzeichnung von KI-Unterstützung</h2>
          <p className={styles.p}>
            Übersetzte Artikel tragen direkt unter der Überschrift den Hinweis{' '}
            <strong>„{AI_LABEL}“</strong> mit Link auf diese Seite. Der Hinweis steht
            bei jedem übersetzten Artikel – unabhängig davon, wie glatt der deutsche
            Text am Ende klingt.
          </p>
          <p className={styles.p}>
            Was KI bei uns nicht macht: Sie führt keine Interviews, erstellt keine
            Testurteile, vergibt keine Bewertungen und verfasst keine Kommentare. Auch
            eigene Ratgeber ohne fremde Vorlage – gekennzeichnet mit „E-AUTOS
            Redaktion“ – entstehen mit KI-Unterstützung; sie tragen den Hinweis
            „KI-gestützte Erstellung“.
          </p>
          <p className={styles.note}>
            Rechtlicher Hintergrund: Artikel 50 Absatz 4 der Verordnung (EU) 2024/1689
            (KI-Verordnung) verlangt seit dem 2. August 2026, dass künstlich erzeugte
            oder bearbeitete Texte als solche offengelegt werden, wenn sie
            veröffentlicht werden, um die Öffentlichkeit über Fragen von öffentlichem
            Interesse zu informieren. Für redaktionell geprüfte Texte besteht eine
            Ausnahme; sie setzt nach unserem Verständnis eine inhaltliche menschliche
            Prüfung und eine benannte redaktionelle Verantwortung voraus. Wir
            kennzeichnen unabhängig von der Auslegung im Einzelfall: Ein Hinweis kostet
            unsere Leserinnen und Leser nichts, verschwiegene Automatisierung kostet
            Vertrauen.
          </p>
        </section>

        <section className={styles.section} id="qualitaet">
          <h2 className={styles.h2}>Qualitätssicherung</h2>
          <p className={styles.p}>
            Unsere Qualitätssicherung steht auf vier Pfeilern:
          </p>
          <ol className={styles.list}>
            <li className={styles.listItem}>
              <strong>Quellenauswahl.</strong> Wir arbeiten mit etablierten
              Fachmedien, nicht mit Forenbeiträgen, Influencer-Videos oder
              Hersteller-Pressemappen als einziger Grundlage einer Meldung.
            </li>
            <li className={styles.listItem}>
              <strong>Glossar.</strong> Marken und Modelle werden über ein festes
              Marken-Glossar einheitlich übertragen – von Atto 3 bis Zeekr 7X; geprüft
              wird zusätzlich, dass der Markenname im deutschen Text vorkommt.
            </li>
            <li className={styles.listItem}>
              <strong>Zahlen.</strong> Preise rechnen wir von Yuan in Euro um – mit
              einem festen Richtkurs, der Yuan-Betrag steht jeweils in Klammern.
              Reichweiten nennen den Prüfzyklus, weil CLTC- und WLTP-Werte nicht
              vergleichbar sind.
            </li>
            <li className={styles.listItem}>
              <strong>Kennzeichnung.</strong> Quelle, Datum, Lesezeit und der
              KI-Hinweis stehen an jedem Artikel.
            </li>
          </ol>
          <p className={styles.p}>
            Die Grenze dieser Methode: Wir sind ein übertragendes Medium. Einen Fehler,
            der schon in der Quelle steht und den unsere Prüfung nicht erkennt,
            übernehmen wir. Genau dafür gibt es den Korrekturweg im nächsten Abschnitt.
          </p>
        </section>

        <section className={styles.section} id="korrekturen">
          <h2 className={styles.h2}>Korrekturen &amp; Kontakt</h2>
          <p className={styles.p}>
            Fehler passieren – besonders beim Übertragen zwischen Sprachen und
            Märkten. Wenn Ihnen etwas falsch erscheint:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              E-Mail: <a className={styles.link} href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>
            </li>
            <li className={styles.listItem}>Telefon: {PUBLISHER.phone}</li>
            <li className={styles.listItem}>
              Bitte nennen Sie den Artikel, die fragliche Stelle und, wenn möglich, die
              Originalquelle.
            </li>
          </ul>
          <p className={styles.p}>
            Wir prüfen jeden Hinweis an der Quelle. Bestätigt sich der Fehler,
            korrigieren wir den Text und ergänzen am Artikelende einen datierten
            Korrekturhinweis. Trifft der Hinweis nicht zu, erklären wir das auf Wunsch
            kurz per E-Mail.
          </p>
          <p className={styles.p}>
            Für Hersteller, Agenturen und Pressestellen: Wir nehmen Pressemitteilungen
            an, veröffentlichen sie aber nicht ungeprüft und nicht gegen Entgelt.
          </p>
        </section>

        <section className={styles.section} id="verantwortung">
          <h2 className={styles.h2}>Redaktionelle Verantwortung</h2>
          <p className={styles.p}>
            Verantwortlich für journalistisch-redaktionelle Inhalte im Sinne des{' '}
            {'§ 18 Abs. 2 MStV'}:
          </p>
          <p className={styles.address}>
            {EDITORIAL_RESPONSIBLE.name}<br />
            {PUBLISHER.street}<br />
            {PUBLISHER.postalCode} {PUBLISHER.city}
          </p>
          <p className={styles.p}>
            Anbieter und Diensteanbieter im Sinne des § 5 DDG ist die{' '}
            {PUBLISHER.legalName}, {PUBLISHER.street}, {PUBLISHER.postalCode}{' '}
            {PUBLISHER.city}, vertreten durch den Geschäftsführer{' '}
            {PUBLISHER.managingDirector}. Handelsregister: {PUBLISHER.registerCourt},{' '}
            {PUBLISHER.registerNumber}. Umsatzsteuer-Identifikationsnummer:{' '}
            {PUBLISHER.vatId}.
          </p>
          <p className={styles.p}>
            Die redaktionelle Verantwortung umfasst die Leitlinien, nach denen Inhalte
            ausgewählt und veröffentlicht werden, sowie die Entscheidung über
            Korrekturen, Sperrungen und Löschungen. Alle Pflichtangaben stehen im{' '}
            <Link className={styles.link} href="/impressum/">Impressum</Link>.
          </p>
        </section>

        <section className={styles.section} id="autoren">
          <h2 className={styles.h2}>Autoren</h2>

          <div className={styles.card} id="lars-bergmann">
            <h3 className={styles.cardTitle}>{AUTHOR.name}</h3>
            <p className={styles.meta}>{AUTHOR.role}</p>
            <p className={styles.p}>
              {AUTHOR.name} ist ein Redaktionspseudonym von E-AUTOS. Übersetzte
              Artikel erscheinen einheitlich unter diesem Namen, weil die Redaktion die
              Inhalte als Ganzes verantwortet. Eine natürliche Person dieses Namens
              gibt es nicht.
            </p>
            <p className={styles.p}>
              Wir legen das offen, weil Sie wissen sollen, mit wem Sie es zu tun
              haben: Bei Rückfragen, Korrekturen und Beschwerden ist die im{' '}
              <Link className={styles.link} href="/impressum/">Impressum</Link> genannte
              verantwortliche Person erreichbar – nicht ein anonymer Autorenname.
            </p>
            <p className={styles.p}>
              Was wir nicht tun: Wir erfinden keine Biografien, keine Berufsstationen,
              keine Beiräte, keine Mitgliedschaften und keine Auszeichnungen. Die
              Autorenangabe in unseren Artikeln beschreibt eine Aufgabe innerhalb der
              Redaktion, keine persönliche Karriere.
            </p>
          </div>

          <p className={styles.p}>
            Ratgeber und Einordnungen ohne fremde Vorlage – etwa unsere Übersicht zu
            den Kosten eines Auto-Imports aus China – erscheinen unter der
            Quellenangabe „E-AUTOS Redaktion“. Sie entstehen mit KI-Unterstützung und
            werden vor der Veröffentlichung automatisiert geprüft; sie tragen den
            Hinweis „KI-gestützte Erstellung“.
          </p>
        </section>

        <section className={styles.section} id="finanzierung">
          <h2 className={styles.h2}>Finanzierung &amp; Werbung</h2>
          <p className={styles.p}>
            E-AUTOS finanziert sich über Werbung und über Affiliate-Links. Beides ist
            gekennzeichnet, beides hat keinen Einfluss auf den Inhalt.
          </p>

          <h3 className={styles.h3}>Google AdSense</h3>
          <p className={styles.p}>
            Die Anzeigenflächen sind mit „Anzeigen“ gekennzeichnet: die In-Article-
            Anzeige steht zwischen zwei Absätzen (nie innerhalb eines Absatzes), die
            Bottom-Anzeige unter dem Artikeltext. Wir verkaufen keine Platzierung
            innerhalb eines Absatzes, und Anzeigenkunden erhalten keine Zusage über
            Inhalte, Reihenfolge oder Bewertung von Artikeln.
          </p>

          <h3 className={styles.h3}>Amazon-Partnerprogramm</h3>
          <p className={styles.p}>
            In vielen Artikeln finden Sie einen als „Anzeige“ gekennzeichneten Kasten
            mit Zubehör-Empfehlungen und Links zu Amazon.de. Kaufen Sie über einen
            dieser Links, erhalten wir eine Provision; der Preis ändert sich für Sie
            nicht. Die Auswahl der Kategorien – Laden, Dashcam, Reifen – ist
            redaktionell und unabhängig vom Provisionssatz.
          </p>

          <h3 className={styles.h3}>Gesponserte Inhalte</h3>
          <p className={styles.p}>
            Derzeit veröffentlichen wir keine gesponserten Artikel, keine bezahlten
            Advertorials und keine bezahlten Markenplatzierungen. Sollte sich das
            ändern, kennzeichnen wir solche Beiträge am Anfang als „Anzeige“ oder
            „Gesponserter Inhalt“ – nicht im Kleingedruckten.
          </p>
          <p className={styles.p}>
            Wir verkaufen keine Redaktionsmitgliedschaften, keine Garantie auf
            Berichterstattung und keine Platzierung in unseren Listen.
          </p>
        </section>

        <section className={styles.section} id="datenschutz">
          <h2 className={styles.h2}>Datenschutz</h2>
          <p className={styles.p}>
            Welche Daten beim Besuch dieser Seite anfallen, steht in der{' '}
            <Link className={styles.link} href="/datenschutz/">Datenschutzerklärung</Link>.
            Kurz: Wir setzen Plausible Analytics ohne Cookies ein; für Google AdSense
            und Vercel Analytics gelten die dort beschriebenen Regelungen. Eine
            erteilte Einwilligung können Sie jederzeit über „Datenschutz-Einstellungen“
            im Seitenfuß ändern oder widerrufen.
          </p>
          <p className={styles.p}>
            Für Redaktionsanfragen genügt eine E-Mail an{' '}
            <a className={styles.link} href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
            Bitte senden Sie keine personenbezogenen Angaben, die für die Anfrage nicht
            nötig sind.
          </p>
        </section>

        <p className={styles.stand}>
          Stand dieser Seite: {REDAKTION_STAND}. Wir aktualisieren sie, wenn sich
          Verfahren, Technik oder Verantwortlichkeiten ändern.
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
