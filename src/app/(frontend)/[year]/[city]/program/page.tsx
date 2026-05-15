import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export default async function ProgramPage({ params }: Props) {
  const { year, city } = await params
  redirect(`/${year}/${city}/umelci`)
}
