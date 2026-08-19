import { getLocale, UI_STRINGS } from '@/lib/locale'

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: UI_STRINGS[locale].privacyTitle }
}

// Static privacy / cookie policy. The cookie table reflects what the site
// actually sets; the surrounding legal text uses [PLACEHOLDER] markers that the
// organisation (data controller) must complete/approve before publishing.
// Can later be moved to a Payload global if the team wants to edit it in the CMS.
export default async function PrivacyPage() {
  const locale = await getLocale()
  const c = CONTENT[locale]

  return (
    <div className="px-6 pt-16 sm:pt-24 pb-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{c.title}</h1>

      {c.intro.map((p, i) => (
        <p key={i} className="text-white/70 mb-4 leading-relaxed">
          {p}
        </p>
      ))}

      <h2 className="text-xl font-bold mt-8 mb-3">{c.controllerHeading}</h2>
      <p className="text-white/70 mb-4 leading-relaxed whitespace-pre-line">{c.controllerText}</p>

      <h2 className="text-xl font-bold mt-8 mb-3">{c.cookiesHeading}</h2>
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

      <h2 className="text-xl font-bold mt-8 mb-3">{c.rightsHeading}</h2>
      <p className="text-white/70 mb-4 leading-relaxed whitespace-pre-line">{c.rightsText}</p>

      <p className="text-white/40 text-xs mt-8 italic">{c.note}</p>
    </div>
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
    provider: 'Biela Noc',
  },
  {
    name: 'bielanoc-consent',
    category: { sk: 'Nevyhnutné', en: 'Necessary' },
    purpose: { sk: 'Uchováva váš výber súhlasu s cookies.', en: 'Stores your cookie consent choice.' },
    duration: { sk: '180 dní', en: '180 days' },
    provider: 'Biela Noc',
  },
  {
    name: 'bielanoc-favorites',
    category: { sk: 'Nevyhnutné', en: 'Necessary' },
    purpose: { sk: 'Uložené obľúbené diela (localStorage).', en: 'Saved favorite artworks (localStorage).' },
    duration: { sk: 'Do vymazania', en: 'Until cleared' },
    provider: 'Biela Noc',
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
    intro: [
      'Táto stránka rešpektuje vaše súkromie. Nevyhnutné cookies používame na základné fungovanie stránky. Analytické a marketingové cookies používame len s vaším súhlasom, ktorý môžete kedykoľvek zmeniť cez odkaz „Nastavenia cookies" v pätičke.',
    ],
    controllerHeading: 'Prevádzkovateľ',
    controllerText:
      '[DOPLNIŤ: názov organizácie, sídlo, IČO]\n[DOPLNIŤ: kontaktný e-mail]\n[DOPLNIŤ: prípadne zodpovedná osoba / DPO]',
    cookiesHeading: 'Aké cookies používame',
    cookiesIntro:
      'Nižšie je prehľad cookies a podobných technológií, ktoré stránka používa. Analytické a marketingové sa načítajú až po udelení súhlasu.',
    tableHeaders: ['Názov', 'Kategória', 'Účel', 'Trvanie', 'Poskytovateľ'],
    rightsHeading: 'Vaše práva',
    rightsText:
      'Máte právo na prístup k svojim údajom, ich opravu alebo vymazanie, obmedzenie spracúvania, namietanie a prenosnosť, a právo kedykoľvek odvolať súhlas. [DOPLNIŤ: postup uplatnenia práv a kontaktné údaje]. Máte tiež právo podať sťažnosť Úradu na ochranu osobných údajov SR.',
    note: 'Poznámka: právny text (prevádzkovateľ, právne základy, doby uchovávania, kontakt) je potrebné doplniť a schváliť organizáciou pred zverejnením.',
  },
  en: {
    title: 'Privacy & Cookie Policy',
    intro: [
      'This site respects your privacy. We use necessary cookies for the site to work. Analytics and marketing cookies are used only with your consent, which you can change at any time via the "Cookie settings" link in the footer.',
    ],
    controllerHeading: 'Data controller',
    controllerText:
      '[TO ADD: organisation name, address, company ID]\n[TO ADD: contact e-mail]\n[TO ADD: data protection officer, if any]',
    cookiesHeading: 'Which cookies we use',
    cookiesIntro:
      'Below is an overview of the cookies and similar technologies the site uses. Analytics and marketing ones load only after consent is granted.',
    tableHeaders: ['Name', 'Category', 'Purpose', 'Duration', 'Provider'],
    rightsHeading: 'Your rights',
    rightsText:
      'You have the right to access, rectify or erase your data, to restrict or object to processing, to data portability, and to withdraw consent at any time. [TO ADD: how to exercise these rights and contact details]. You also have the right to lodge a complaint with the Slovak Data Protection Authority.',
    note: 'Note: the legal text (controller, legal bases, retention periods, contact) must be completed and approved by the organisation before publishing.',
  },
} as const
