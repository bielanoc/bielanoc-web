import Link from 'next/link'
import { getLocale, UI_STRINGS } from '@/lib/locale'

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: UI_STRINGS[locale].privacyTitle }
}

// Privacy / cookie policy. Controller details are from the Slovak business
// register (Biela noc s.r.o., IČO 48 325 139). The cookie table reflects what
// the site actually sets. Standard legal sections (purposes, legal bases,
// rights, supervisory authority) are filled; a final legal review by the
// organisation is recommended before relying on it. Can later move to a Payload
// global if the team wants to edit it in the CMS.
export default async function PrivacyPage() {
  const locale = await getLocale()
  const c = CONTENT[locale]

  return (
    <div className="px-6 pt-16 sm:pt-24 pb-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
      <p className="text-white/40 text-sm mb-8">{c.effectiveDate}</p>

      {c.intro.map((p, i) => (
        <p key={i} className="text-white/70 mb-4 leading-relaxed">
          {p}
        </p>
      ))}

      <Section heading={c.controllerHeading}>
        <div className="text-white/70 leading-relaxed whitespace-pre-line">{c.controllerText}</div>
      </Section>

      <Section heading={c.purposesHeading}>
        <List items={c.purposes} />
      </Section>

      <Section heading={c.legalBasisHeading}>
        <List items={c.legalBasis} />
      </Section>

      <Section heading={c.cookiesHeading}>
        <p className="text-white/70 mb-4 leading-relaxed">{c.cookiesIntro}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border border-white/10">
            <thead>
              <tr className="border-b border-white/10 text-white/80">
                {c.tableHeaders.map((h) => (
                  <th key={h} className="p-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COOKIE_ROWS.map((row) => (
                <tr key={row.name} className="border-b border-white/5 text-white/60 align-top">
                  <td className="p-3 font-mono text-xs text-white/80">{row.name}</td>
                  <td className="p-3">{row.category[locale]}</td>
                  <td className="p-3">{row.purpose[locale]}</td>
                  <td className="p-3">{row.duration[locale]}</td>
                  <td className="p-3">{row.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section heading={c.transfersHeading}>
        <p className="text-white/70 leading-relaxed">{c.transfersText}</p>
      </Section>

      <Section heading={c.retentionHeading}>
        <p className="text-white/70 leading-relaxed">{c.retentionText}</p>
      </Section>

      <Section heading={c.rightsHeading}>
        <p className="text-white/70 mb-3 leading-relaxed">{c.rightsIntro}</p>
        <List items={c.rights} />
        <p className="text-white/70 mt-3 leading-relaxed">{c.rightsOutro}</p>
      </Section>

      <Section heading={c.authorityHeading}>
        <div className="text-white/70 leading-relaxed whitespace-pre-line">{c.authorityText}</div>
        <a
          href="https://dataprotection.gov.sk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          dataprotection.gov.sk
        </a>
      </Section>

      <Section heading={c.contactHeading}>
        <p className="text-white/70 leading-relaxed">
          {c.contactText}{' '}
          <Link href="/kontakt" className="text-accent hover:underline">
            {c.contactLink}
          </Link>
          .
        </p>
      </Section>

      <p className="text-white/40 text-xs mt-8 italic">{c.reviewNote}</p>
    </div>
  )
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="text-xl font-bold mt-8 mb-3">{heading}</h2>
      {children}
    </>
  )
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1 text-white/70 leading-relaxed">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

type Row = {
  name: string
  category: Record<'sk' | 'en', string>
  purpose: Record<'sk' | 'en', string>
  duration: Record<'sk' | 'en', string>
  provider: string
}

const COOKIE_ROWS: Row[] = [
  {
    name: 'locale',
    category: { sk: 'Nevyhnutné', en: 'Necessary' },
    purpose: { sk: 'Uložený jazyk stránky (SK/EN).', en: 'Stored site language (SK/EN).' },
    duration: { sk: '1 rok', en: '1 year' },
    provider: 'Biela noc s.r.o.',
  },
  {
    name: 'bielanoc-consent',
    category: { sk: 'Nevyhnutné', en: 'Necessary' },
    purpose: { sk: 'Uchováva váš výber súhlasu s cookies.', en: 'Stores your cookie consent choice.' },
    duration: { sk: '180 dní', en: '180 days' },
    provider: 'Biela noc s.r.o.',
  },
  {
    name: 'bielanoc-favorites',
    category: { sk: 'Nevyhnutné', en: 'Necessary' },
    purpose: { sk: 'Uložené obľúbené diela (localStorage).', en: 'Saved favorite artworks (localStorage).' },
    duration: { sk: 'Do vymazania', en: 'Until cleared' },
    provider: 'Biela noc s.r.o.',
  },
  {
    name: '_ga, _gid',
    category: { sk: 'Analytické', en: 'Analytics' },
    purpose: { sk: 'Meranie návštevnosti (Google Analytics).', en: 'Traffic measurement (Google Analytics).' },
    duration: { sk: 'až 2 roky', en: 'up to 2 years' },
    provider: 'Google',
  },
  {
    name: '_fbp',
    category: { sk: 'Marketingové', en: 'Marketing' },
    purpose: { sk: 'Meranie a cielenie reklamy (Meta Pixel).', en: 'Advertising measurement/targeting (Meta Pixel).' },
    duration: { sk: '90 dní', en: '90 days' },
    provider: 'Meta',
  },
  {
    name: 'mapové dlaždice / map tiles',
    category: { sk: 'Nevyhnutné', en: 'Necessary' },
    purpose: {
      sk: 'Zobrazenie mapy; poskytovateľ spracúva IP adresu.',
      en: 'Map display; the provider processes your IP address.',
    },
    duration: { sk: '—', en: '—' },
    provider: 'CARTO / OpenStreetMap',
  },
]

const CONTENT = {
  sk: {
    title: 'Ochrana osobných údajov a cookies',
    effectiveDate: 'Účinné od: 19. 8. 2026',
    intro: [
      'Táto stránka rešpektuje vaše súkromie. Nevyhnutné cookies používame na základné fungovanie stránky. Analytické a marketingové cookies používame len s vaším súhlasom, ktorý môžete kedykoľvek zmeniť cez odkaz „Nastavenia cookies" v pätičke.',
    ],
    controllerHeading: 'Prevádzkovateľ',
    controllerText:
      'Biela noc s.r.o.\nFloriánska 9, 040 01 Košice\nIČO: 48 325 139\nSpoločnosť s ručením obmedzeným, zapísaná v Obchodnom registri Mestského súdu Košice, oddiel: Sro.',
    purposesHeading: 'Účely spracúvania',
    purposes: [
      'Zabezpečenie základných funkcií stránky (jazyk, uložené obľúbené diela, zapamätanie súhlasu s cookies).',
      'Meranie návštevnosti a zlepšovanie obsahu (analytické cookies – Google Analytics).',
      'Meranie a cielenie reklamy (marketingové cookies – Meta Pixel).',
      'Zobrazenie interaktívnej mapy podujatia (mapové dlaždice – spracúva sa IP adresa).',
    ],
    legalBasisHeading: 'Právny základ',
    legalBasis: [
      'Nevyhnutné cookies a funkcie: oprávnený záujem, resp. nevyhnutnosť na poskytnutie služby (čl. 6 ods. 1 písm. f) resp. b) GDPR).',
      'Analytické a marketingové cookies: váš súhlas (čl. 6 ods. 1 písm. a) GDPR), ktorý môžete kedykoľvek odvolať.',
    ],
    cookiesHeading: 'Aké cookies používame',
    cookiesIntro:
      'Nižšie je prehľad cookies a podobných technológií, ktoré stránka používa. Analytické a marketingové sa načítajú až po udelení súhlasu.',
    tableHeaders: ['Názov', 'Kategória', 'Účel', 'Trvanie', 'Poskytovateľ'],
    transfersHeading: 'Prenos údajov mimo EÚ',
    transfersText:
      'Pri používaní Google Analytics a Meta Pixel môže dochádzať k prenosu údajov spoločnostiam Google a Meta vrátane do USA. Títo poskytovatelia uplatňujú štandardné zmluvné doložky, resp. rámec EU–US Data Privacy Framework. Tieto nástroje sa aktivujú len s vaším súhlasom.',
    retentionHeading: 'Doba uchovávania',
    retentionText:
      'Údaje z cookies uchovávame po dobu uvedenú v tabuľke vyššie. Váš súhlas s cookies uchovávame 180 dní, po ich uplynutí sa vás naň opýtame znova.',
    rightsHeading: 'Vaše práva',
    rightsIntro: 'V súvislosti so spracúvaním osobných údajov máte tieto práva:',
    rights: [
      'právo na prístup k údajom,',
      'právo na opravu,',
      'právo na vymazanie („právo byť zabudnutý"),',
      'právo na obmedzenie spracúvania,',
      'právo namietať proti spracúvaniu,',
      'právo na prenosnosť údajov,',
      'právo kedykoľvek odvolať súhlas (bez vplyvu na zákonnosť spracúvania pred jeho odvolaním).',
    ],
    rightsOutro:
      'Súhlas s cookies odvoláte alebo zmeníte kedykoľvek cez odkaz „Nastavenia cookies" v pätičke stránky.',
    authorityHeading: 'Dozorný orgán',
    authorityText:
      'Ak sa domnievate, že spracúvame vaše údaje v rozpore s právnymi predpismi, máte právo podať sťažnosť dozornému orgánu:\nÚrad na ochranu osobných údajov Slovenskej republiky\nHraničná 12, 820 07 Bratislava 27\n',
    contactHeading: 'Kontakt',
    contactText:
      'V otázkach ochrany osobných údajov nás môžete kontaktovať písomne na adrese sídla spoločnosti alebo prostredníctvom stránky',
    contactLink: 'Kontakt',
    reviewNote:
      'Tento dokument má informatívny charakter; pred zverejnením odporúčame jeho kontrolu zodpovednou osobou / právnikom.',
  },
  en: {
    title: 'Privacy & Cookie Policy',
    effectiveDate: 'Effective from: 19 Aug 2026',
    intro: [
      'This site respects your privacy. We use necessary cookies for the site to work. Analytics and marketing cookies are used only with your consent, which you can change at any time via the "Cookie settings" link in the footer.',
    ],
    controllerHeading: 'Data controller',
    controllerText:
      'Biela noc s.r.o.\nFloriánska 9, 040 01 Košice, Slovakia\nCompany ID (IČO): 48 325 139\nLimited liability company, registered in the Commercial Register of the Municipal Court Košice, section Sro.',
    purposesHeading: 'Purposes of processing',
    purposes: [
      'Providing core site functions (language, saved favorite artworks, remembering your cookie consent).',
      'Measuring traffic and improving content (analytics cookies – Google Analytics).',
      'Measuring and targeting advertising (marketing cookies – Meta Pixel).',
      'Displaying the interactive event map (map tiles – your IP address is processed).',
    ],
    legalBasisHeading: 'Legal basis',
    legalBasis: [
      'Necessary cookies and functions: legitimate interest / necessity to provide the service (Art. 6(1)(f) resp. (b) GDPR).',
      'Analytics and marketing cookies: your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time.',
    ],
    cookiesHeading: 'Which cookies we use',
    cookiesIntro:
      'Below is an overview of the cookies and similar technologies the site uses. Analytics and marketing ones load only after consent is granted.',
    tableHeaders: ['Name', 'Category', 'Purpose', 'Duration', 'Provider'],
    transfersHeading: 'Transfers outside the EU',
    transfersText:
      'When using Google Analytics and Meta Pixel, data may be transferred to Google and Meta, including to the USA. These providers rely on Standard Contractual Clauses and/or the EU–US Data Privacy Framework. These tools are activated only with your consent.',
    retentionHeading: 'Retention period',
    retentionText:
      'Cookie data is retained for the durations listed in the table above. Your cookie consent is stored for 180 days, after which we ask again.',
    rightsHeading: 'Your rights',
    rightsIntro: 'In relation to the processing of personal data you have the following rights:',
    rights: [
      'right of access,',
      'right to rectification,',
      'right to erasure ("right to be forgotten"),',
      'right to restriction of processing,',
      'right to object to processing,',
      'right to data portability,',
      'right to withdraw consent at any time (without affecting the lawfulness of processing before withdrawal).',
    ],
    rightsOutro:
      'You can withdraw or change your cookie consent at any time via the "Cookie settings" link in the footer.',
    authorityHeading: 'Supervisory authority',
    authorityText:
      'If you believe we process your data unlawfully, you have the right to lodge a complaint with the supervisory authority:\nOffice for Personal Data Protection of the Slovak Republic\nHraničná 12, 820 07 Bratislava 27, Slovakia\n',
    contactHeading: 'Contact',
    contactText:
      'For any data-protection questions you can contact us in writing at the registered address, or via our',
    contactLink: 'Contact',
    reviewNote:
      'This document is informational; we recommend a review by a responsible person / lawyer before publishing.',
  },
} as const
