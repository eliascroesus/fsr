import Image from 'next/image';

const FOOTER_LINKS = [
  { label: 'Integritetspolicy', href: 'https://www.aiacquisition.com/privacy-policy' },
  { label: 'Användarvillkor', href: 'https://www.aiacquisition.com/terms-of-service' },
  { label: 'Kontakta oss', href: 'mailto:support@aiarbitrageagency.com' },
];

export function SiteFooter() {
  return (
    <section id="footer" className="bg-background text-center px-4 py-8 text-xs">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex justify-center">
          <Image
            src="/images/new-logo.png"
            alt="AI Acquisition LLC-logga"
            width={48}
            height={48}
            className="opacity-50"
          />
        </div>

        <p className="text-muted-foreground">
          AI Acquisition och alla personer som är knutna till organisationen tar inget ansvar för
          utfallet, resultatet eller framgången av tjänsterna och garanterar inga specifika resultat
          eller utfall. Framgång beror bland annat på hur mycket tid du lägger ner och på hur du
          tillämpar den vägledning, de strategier och det stöd du får. Strategierna, innehållet,
          artiklarna och alla övriga funktioner är uteslutande i utbildningssyfte.
        </p>

        <p className="text-muted-foreground">
          Även om våra tjänster och produkter är anpassade efter våra kunder kan vi inte lämna
          några garantier eller utfästelser (varken uttryckliga eller underförstådda) om resultat
          eller om att tjäna pengar på de idéer, den information, de verktyg och de strategier som
          ingår i tjänsterna. Eventuella omdömen kommer från verkliga personer och företag och deras
          egna personliga och individuella upplevelser. De ska inte uppfattas som
          &quot;typiska&quot; resultat och kommer inte att vara specifika för just dina förhållanden
          eller de åtgärder du väljer att vidta efter att ha tagit del av tjänsterna och
          produkterna.
        </p>

        <p className="text-muted-foreground">
          I en undersökning bland över 660 företag, varav över 100 svarade, hade företagarna i
          genomsnitt 18 105 $ i månadsomsättning efter att ha implementerat vårt system.
        </p>

        <p className="text-muted-foreground">
          Dessutom INTE GOOGLE eller FACEBOOK: Den här sidan är inte en del av Googles webbplats,
          Google Inc, Facebook/Metas webbplats eller Meta, Inc. Sidan är inte heller på något sätt
          godkänd av Google eller Meta.
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
          © {new Date().getFullYear()} AI Acquisition LLC. Med ensamrätt.
        </p>
      </div>
    </section>
  );
}
