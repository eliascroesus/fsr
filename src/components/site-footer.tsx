import Image from 'next/image';

const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: 'https://www.aiacquisition.com/privacy-policy' },
  { label: 'Terms of Service', href: 'https://www.aiacquisition.com/terms-of-service' },
  { label: 'Contact Us', href: 'mailto:support@aiarbitrageagency.com' },
];

export function SiteFooter() {
  return (
    <section id="footer" className="bg-background text-center px-4 py-8 text-xs">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex justify-center">
          <Image
            src="/images/new-logo.png"
            alt="AI Acquisition LLC Logo"
            width={48}
            height={48}
            className="opacity-50"
          />
        </div>

        <p className="text-muted-foreground">
          AI Acquisition and all individuals affiliated with this organization assumes no
          responsibility for the outcome, result, or success of the services, and does not guarantee
          specific results or outcome. Success depends in part on the time you devote, and your
          implementation of the guidance, strategies and support received. The strategies, content,
          articles and all other features are for educational purposes only.
        </p>

        <p className="text-muted-foreground">
          Though our services and products are tailored for our clients, we cannot give any
          guarantees or warranties (either express or implied), about results or earning money with
          the ideas, information, tools and strategies set out in the services. Any testimonials
          provided are of real-life individuals and businesses and their own personal and individual
          experiences. These must not be taken as &quot;typical&quot; results and will not be
          specific to your particular circumstances or actions you choose to take following receipt
          of the services and products.
        </p>

        <p className="text-muted-foreground">
          In a survey of over 660 businesses with over 100 responding, business owners averaged
          $18,105 in monthly revenue after implementing our system.
        </p>

        <p className="text-muted-foreground">
          Also NOT GOOGLE or FACEBOOK: This site is not a part of the Google website, Google Inc,
          Facebook/Meta website, or Meta, Inc. Additionally, This site is NOT endorsed by Google or
          Meta in any way.
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
          © {new Date().getFullYear()} AI Acquisition LLC. All rights reserved.
        </p>
      </div>
    </section>
  );
}
