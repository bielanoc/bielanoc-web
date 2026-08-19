import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'navigation-settings',
    data: {
      menuItems: [
        { label: 'Domov', url: '/', useYearCity: false, icon: 'none', dividerAfter: false },
        { label: 'Vyhľadávanie', url: '/search', useYearCity: false, icon: 'search', dividerAfter: true },
        { label: 'Umelci', url: '/umelci', useYearCity: true, icon: 'none', dividerAfter: false },
        { label: 'Mapa', url: '/mapa', useYearCity: true, icon: 'none', dividerAfter: false },
        { label: 'Partneri', url: '/partneri', useYearCity: true, icon: 'none', dividerAfter: false },
        { label: 'Info', url: '/info', useYearCity: true, icon: 'none', dividerAfter: false },
        { label: 'Vstupenky', url: '/predaj', useYearCity: true, icon: 'none', dividerAfter: false },
        { label: 'Dobrovoľníci', url: '/dobrovolnici', useYearCity: true, icon: 'none', dividerAfter: true },
        { label: 'O Bielej Noci', url: '/o-bielej-noci', useYearCity: false, icon: 'none', dividerAfter: false },
        { label: 'Kontakt', url: '/kontakt', useYearCity: false, icon: 'none', dividerAfter: false },
        { label: 'Podporte nás', url: '/podporte-nas', useYearCity: false, icon: 'none', dividerAfter: false },
        { label: 'Press', url: '/press', useYearCity: false, icon: 'none', dividerAfter: false },
        { label: 'Archív', url: '/archive', useYearCity: false, icon: 'none', dividerAfter: false },
        { label: 'App', url: '/app', useYearCity: false, icon: 'none', dividerAfter: false },
      ],
    },
  })

  console.log('Menu items saved successfully!')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
