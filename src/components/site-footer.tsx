import Image from 'next/image';

/**
 * Relativa sökvägar tills FSR:s riktiga sidor finns — byt till fulla adresser
 * när de är publicerade.
 */
const FOOTER_LINKS = [
  { label: 'Integritetspolicy', href: '/integritetspolicy' },
  { label: 'Användarvillkor', href: '/anvandarvillkor' },
  { label: 'Kontakta oss', href: 'mailto:support@fsr.se' },
];

export function SiteFooter() {
  return (
    <section id="footer" className="bg-background text-center px-4 py-8 text-xs">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex justify-center">
          <Image
            src="/images/new-logo.png"
            alt="FSR-logga"
            width={48}
            height={48}
            className="opacity-50"
          />
        </div>

        <p className="text-muted-foreground">
          FSR och alla personer som är knutna till företaget tar inget ansvar för utfallet,
          resultatet eller framgången av tjänsterna, och garanterar inga specifika resultat. Hur det
          går beror bland annat på hur mycket tid du lägger ner och på hur du tillämpar den
          vägledning och det stöd du får. Innehållet och alla övriga funktioner är uteslutande i
          utbildningssyfte.
        </p>

        <p className="text-muted-foreground">
          Vi kan inte lämna några garantier eller utfästelser, varken uttryckliga eller
          underförstådda, om resultat eller om att tjäna pengar på de metoder, den information och
          de strategier som ingår. Försäljning av högprisprodukter kräver eget arbete, och
          resultaten varierar från person till person.
        </p>

        <p className="text-muted-foreground">
          Eventuella omdömen kommer från verkliga personer och beskriver deras egna individuella
          upplevelser. De ska inte uppfattas som typiska resultat och kommer inte att vara specifika
          för just dina förhållanden eller de åtgärder du väljer att vidta.
        </p>

        <p className="text-muted-foreground">
          Den här sidan är inte en del av Googles webbplats, Google Inc, Facebook/Metas webbplats
          eller Meta, Inc. Sidan är inte heller på något sätt godkänd av Google eller Meta.
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
          © {new Date().getFullYear()} FSR. Med ensamrätt.
        </p>
      </div>
    </section>
  );
}
