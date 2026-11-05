import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung und Informationen zum Schutz Ihrer Daten bei E-AUTOS.',
  robots: { index: false, follow: false },
}

export default function DatenschutzPage() {
  return (
    <>
      <SiteHeader />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Datenschutzerklärung</h1>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          1. Datenschutz auf einen Blick
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
          Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
          werden können.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          2. Verantwortliche Stelle
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Zhinai Liu<br />
          Forsthaus 22<br />
          D-40883 Ratingen<br />
          E-Mail: <a href="mailto:l.bai@loghan.de">l.bai@loghan.de</a>
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          3. Datenerfassung auf dieser Website
        </h2>
        <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Server-Log-Dateien
        </h3>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in
          sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
          Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer
          URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und
          IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
          nicht vorgenommen.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          4. Ihre Rechte
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
          Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
          Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten
          zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
          können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Hierzu
          sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an
          uns wenden.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          5. Hosting
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Diese Website wird bei Vercel gehostet. Anbieter ist die Vercel Inc.,
          440 N Barranca Ave #4133, Covina, CA 91723, USA. Vercel erhebt
          Server-Log-Dateien wie oben beschrieben. Mehr Informationen zum
          Datenschutz bei Vercel finden Sie in der{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung von Vercel
          </a>{' '}
          (Einzelheiten zur Übermittlung in die USA unter Ziffer 11).
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          6. Amazon-Partnerprogramm
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Diese Website nimmt am Amazon-Partnerprogramm teil. Mit „Anzeige“
          gekennzeichnete Links sind Partner-Links: Wenn Sie darauf klicken, werden
          Sie auf die Website von Amazon.de weitergeleitet. Erst dort setzt Amazon
          eigene Cookies und verarbeitet Daten, um einen Verkauf beziehungsweise
          eine Vermittlung nachzuvollziehen. Wir selbst setzen im Zusammenhang mit
          den Partner-Links keine Cookies und legen keine Nutzerprofile an. Für Sie
          ändert sich der Preis nicht: Eine Provision, die wir bei einem
          qualifizierten Kauf erhalten, hat keinen Einfluss auf den von Ihnen
          gezahlten Preis.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          7. Erfassung von Klicks auf Partner-Links
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Wenn Sie einen Partner-Link anklicken, sendet Ihr Browser eine kurze
          Anfrage an unseren Server. Dabei speichern wir den angeklickten
          Werbeplatz (Slot), das Tagesdatum als Zeitstempel sowie eine mit
          SHA-256 gehashte Kennung Ihrer IP-Adresse. Die gehashte Kennung dient
          ausschließlich der Begrenzung der Anfragen pro Tag (Missbrauchsschutz);
          Ihre IP-Adresse wird nicht im Klartext gespeichert. Diese Daten nutzen
          wir nur zur statistischen Auswertung der Klickzahlen und löschen sie
          automatisch nach 90 Tagen. Eine Zusammenführung mit anderen
          Datenquellen oder eine Identifizierung Ihrer Person findet nicht statt.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          8. Google AdSense
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Diese Website nutzt Google AdSense, einen Dienst der Google Ireland
          Limited, um Werbeanzeigen auszuliefern. Google AdSense verwendet Cookies
          und vergleichbare Technologien (einschließlich Speicherung auf Ihrem
          Endgerät), um Anzeigen anzuzeigen und auszuwerten. Dabei können unter
          anderem Ihre IP-Adresse, Angaben zu Browser und Gerät sowie Ihr
          Nutzungsverhalten verarbeitet und an Google übertragen werden. Die
          Einbindung zu Zwecken personalisierter Werbung erfolgt auf Grundlage
          Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO; diese Einwilligung
          können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Weitere
          Informationen finden Sie in der{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung von Google
          </a>.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Für Anzeigen aus dem AdSense-Programm handeln Sie und Google nach den
          Google Ads Controller-Controller Data Protection Terms als
          voneinander unabhängige Verantwortliche; Google ist insoweit nicht
          unser Auftragsverarbeiter. Wie Google Informationen aus Websites
          verarbeitet, die seine Dienste nutzen, beschreibt Google unter{' '}
          <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">
            business.safety.google/privacy
          </a>.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Für die Einholung Ihrer Einwilligung setzen wir die von Google
          bereitgestellte, nach IAB TCF zertifizierte Consent-Management-Plattform
          („Datenschutz und Mitteilungen“, früher „Funding Choices“, CMP-ID 300)
          ein. Solange Sie keine Wahl getroffen haben, werden über unsere Seiten
          keine Anzeigen ausgeliefert. Wenn Sie die Verwendung von Cookies für
          personalisierte Werbung ablehnen, können Ihnen dennoch nicht
          personalisierte Anzeigen mit eingeschränktem Targeting ausgeliefert
          werden. Diese richten sich nicht nach Ihrem früheren Verhalten,
          sondern nach Kontextsignalen wie einer groben geografischen Zuordnung.
          Nach Angaben von Google werden dabei aber weiterhin Cookies oder
          vergleichbare Kennungen eingesetzt – insbesondere zur Begrenzung der
          Anzeigenhäufigkeit (Frequency Capping) und für aggregierte
          Werbeberichte –, und für diese Verwendung verlangt Google im EWR eine
          Einwilligung.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Das Speichern von Informationen auf Ihrem Endgerät und das Auslesen
          daraus im Zusammenhang mit AdSense erfolgt auf Grundlage Ihrer
          Einwilligung nach § 25 Abs. 1 TDDDG. Soweit Anzeigen ausgeliefert
          werden, stützen wir die damit verbundene Verarbeitung auf Ihre
          Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO; soweit keine
          Einwilligung vorliegt, auf unser berechtigtes Interesse an der
          Finanzierung dieses Angebots nach Art. 6 Abs. 1 lit. f DSGVO, dem Sie
          nach Art. 21 DSGVO widersprechen können.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Unabhängig von der Werbeeinwilligung speichern wir Ihre gewählte
          Darstellung (hell/dunkel) und die Kennzeichnung bereits reagierter
          Artikel im lokalen Speicher Ihres Browsers. Dies ist für die von Ihnen
          ausdrücklich gewünschte Funktion unbedingt erforderlich und daher nach
          § 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
          ändern oder widerrufen – über den Link „Datenschutz-Einstellungen“ in
          der Fußzeile jeder Seite öffnet sich das Auswahlfenster erneut. Sollte
          sich dieses Fenster bei Ihnen nicht öffnen (etwa weil ein Werbeblocker
          die Skripte von Google unterbindet), können Sie Ihre Einwilligung auch
          per E-Mail an die im Impressum genannte Adresse widerrufen. Die
          Personalisierung von Werbeanzeigen in Ihrem Google-Konto können Sie
          zudem jederzeit über die{' '}
          <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
            Google-Anzeigeneinstellungen
          </a>{' '}
          deaktivieren.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          9. Plausible und Vercel Web Analytics
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Zur Reichweitenmessung setzen wir Plausible Analytics (Plausible
          Insights OÜ, Estland) sowie Vercel Web Analytics ein. Beide Dienste
          arbeiten ohne Cookies und setzen keine Kennungen auf Ihrem Endgerät. Zur
          Erkennung wiederkehrender Besucher wird aus IP-Adresse, User-Agent und
          einem täglich wechselnden Salt ein Hashwert gebildet, der spätestens
          nach 24 Stunden verfällt; IP-Adresse und User-Agent werden nicht
          dauerhaft gespeichert. Die Auswertung erfolgt aggregiert, ein
          dauerhafter Personenbezug wird nicht hergestellt. Rechtsgrundlage ist
          unser berechtigtes Interesse an einer datensparsamen Reichweitenmessung
          nach Art. 6 Abs. 1 lit. f DSGVO; dieser Verarbeitung können Sie nach
          Art. 21 DSGVO widersprechen.
        </p>
        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          10. Newsletter
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Wenn Sie unseren Newsletter abonnieren, verarbeiten wir Ihre
          E-Mail-Adresse zum Zweck des Versands. Die Anmeldung erfolgt im
          Double-Opt-in-Verfahren: Sie erhalten zunächst eine Bestätigungsmail;
          erst nach Klick auf den darin enthaltenen Link wird Ihre Adresse in
          unsere Empfängerliste aufgenommen. Ohne Bestätigung löschen wir die
          Adresse nach 48 Stunden. Rechtsgrundlage ist Ihre Einwilligung nach
          Art. 6 Abs. 1 lit. a DSGVO. Sie können diese Einwilligung jederzeit
          mit Wirkung für die Zukunft widerrufen – über den Abmeldelink in jeder
          Newsletter-E-Mail oder per E-Mail an die im Impressum genannte
          Adresse.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Für den Versand nutzen wir den Dienst Resend, betrieben von der Plus
          Five Five, Inc. (USA), als Auftragsverarbeiter; dabei wird Ihre
          E-Mail-Adresse an Resend übermittelt. Die Übermittlung in die USA
          erfolgt nach Angaben des Anbieters auf Grundlage der
          Standardvertragsklauseln nach Art. 46 Abs. 2 DSGVO sowie des EU-US
          Data Privacy Framework einschließlich der UK-Erweiterung. Weitere
          Informationen finden Sie in der{' '}
          <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung von Resend
          </a>.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          11. Übermittlung von Daten in Drittländer
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Einige der von uns eingesetzten Dienstleister verarbeiten Daten
          außerhalb der EU beziehungsweise des EWR, insbesondere in den USA. Die
          Übermittlung erfolgt vorrangig auf Grundlage eines
          Angemessenheitsbeschlusses der EU-Kommission nach Art. 45 DSGVO
          (EU-US Data Privacy Framework), soweit der jeweilige Anbieter
          zertifiziert ist, und im Übrigen auf Grundlage von
          Standardvertragsklauseln nach Art. 46 Abs. 2 DSGVO. Im Einzelnen:
        </p>
        <ul style={{ marginBottom: '1rem', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
          <li>
            <strong>Google Ireland Limited / Google LLC (USA)</strong> für
            AdSense: nach Angaben von Google seit dem 1. September 2023 auf
            Grundlage des EU-US Data Privacy Framework; soweit dieses nicht
            greift oder nicht mehr in Anspruch genommen wird, auf Grundlage der
            Standardvertragsklauseln.
          </li>
          <li>
            <strong>Vercel Inc. (USA)</strong> für Hosting und Vercel Web
            Analytics: Standardvertragsklauseln gemäß dem Data Processing
            Addendum von Vercel, das für Kunden der Pro- und Enterprise-Pläne
            gilt; Vercel gibt zusätzlich eine eigene Zertifizierung nach dem
            EU-US Data Privacy Framework an. Die Verarbeitung erfolgt
            hauptsächlich in den USA. Für die im Rahmen von Vercel Web
            Analytics anfallenden, aggregierten Nutzungsdaten ist Vercel nach
            seinen eigenen Bedingungen selbst Verantwortlicher.
          </li>
          <li>
            <strong>Upstash, Inc. (USA)</strong> als Betreiber der Datenbank, in
            der die unter Ziffer 7 genannten Klick-Zähler liegen; wir beziehen
            sie über die Vercel-Marketplace-Integration „Upstash for Redis“. Die
            Daten werden in der Region Frankfurt am Main (EU) gespeichert; eine
            Übermittlung in die USA erfolgt nur im Rahmen von Support- und
            Wartungszugriffen, gestützt auf das EU-US Data Privacy Framework,
            hilfsweise auf Standardvertragsklauseln.
          </li>
          <li>
            <strong>Plus Five Five, Inc. („Resend“, USA)</strong> für den
            Newsletter-Versand: nach Angaben des Anbieters
            Standardvertragsklauseln; die Zertifizierung nach dem EU-US Data
            Privacy Framework einschließlich der UK-Erweiterung ergibt sich aus
            der Liste des US-Handelsministeriums.
          </li>
          <li>
            <strong>Plausible Insights OÜ (Estland)</strong> verarbeitet und
            speichert die unter Ziffer 9 beschriebene Reichweitenmessung
            innerhalb der EU; eine Übermittlung in ein Drittland findet insoweit
            nicht statt.
          </li>
        </ul>
        <p style={{ lineHeight: 1.7 }}>
          Mit den Dienstleistern, die als Auftragsverarbeiter für uns tätig
          sind (Vercel, Resend, Plausible und Upstash), bestehen Verträge zur
          Auftragsverarbeitung nach Art. 28 DSGVO. Eine über die genannten
          Empfänger hinausgehende Übermittlung personenbezogener Daten durch uns
          an Dritte oder ein Verkauf von Daten findet nicht statt. Soweit Google
          Daten als eigenständiger Verantwortlicher an Werbepartner weitergibt,
          richtet sich dies nach der Datenschutzerklärung von Google; die
          beteiligten Partner sind im Einwilligungsdialog ausgewiesen.
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
