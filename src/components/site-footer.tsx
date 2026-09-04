import Image from 'next/image';

const FOOTER_LINKS = [
  { label: 'Privatlivspolitik', href: 'https://www.aiacquisition.com/privacy-policy' },
  { label: 'Handelsbetingelser', href: 'https://www.aiacquisition.com/terms-of-service' },
  { label: 'Kontakt os', href: 'mailto:support@aiarbitrageagency.com' },
];

export function SiteFooter() {
  return (
    <section id="footer" className="bg-background text-center px-4 py-8 text-xs">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex justify-center">
          <Image
            src="/images/new-logo.png"
            alt="AI Acquisition LLC-logo"
            width={48}
            height={48}
            className="opacity-50"
          />
        </div>

        <p className="text-muted-foreground">
          AI Acquisition og alle personer tilknyttet denne organisation påtager sig intet ansvar
          for udfaldet, resultatet eller succesen af ydelserne og garanterer ikke bestemte
          resultater eller udfald. Succes afhænger blandt andet af den tid, du lægger i det, og af
          din anvendelse af den vejledning, de strategier og den støtte, du modtager. Strategierne,
          indholdet, artiklerne og alle øvrige funktioner er udelukkende til undervisningsbrug.
        </p>

        <p className="text-muted-foreground">
          Selvom vores ydelser og produkter er tilpasset vores kunder, kan vi ikke give nogen
          garantier eller indeståelser (hverken udtrykkelige eller underforståede) for resultater
          eller for at tjene penge med de idéer, oplysninger, værktøjer og strategier, der indgår i
          ydelserne. Eventuelle udtalelser stammer fra virkelige personer og virksomheder og deres
          egne personlige og individuelle oplevelser. De må ikke opfattes som
          &quot;typiske&quot; resultater og vil ikke være specifikke for netop dine forhold eller de
          handlinger, du vælger at foretage efter modtagelsen af ydelserne og produkterne.
        </p>

        <p className="text-muted-foreground">
          I en undersøgelse blandt over 660 virksomheder, hvoraf over 100 svarede, havde
          virksomhedsejerne i gennemsnit $18.105 i månedlig omsætning efter at have implementeret
          vores system.
        </p>

        <p className="text-muted-foreground">
          Desuden IKKE GOOGLE eller FACEBOOK: Denne side er ikke en del af Googles hjemmeside,
          Google Inc, Facebook/Metas hjemmeside eller Meta, Inc. Denne side er heller IKKE på nogen
          måde godkendt af Google eller Meta.
        </p>

        <div className="flex justify-center space-x-8">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-muted-foreground">
          © {new Date().getFullYear()} AI Acquisition LLC. Alle rettigheder forbeholdes.
        </p>
      </div>
    </section>
  );
}
