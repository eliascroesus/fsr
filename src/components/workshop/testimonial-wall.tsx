import Image from 'next/image';

import { SUCCESS_WINS } from '@/lib/success-wins';

/**
 * CSS-column masonry: 1 column on mobile, 2 from sm, 3 from lg. Cards use
 * break-inside-avoid so a screenshot never splits across a column boundary.
 */
export function TestimonialWall() {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
        What People Are Saying
      </h2>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {SUCCESS_WINS.map((win) => (
          <div key={win.slug} className="break-inside-avoid mb-4">
            <Image
              src={win.src}
              alt={win.alt}
              width={400}
              height={300}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </>
  );
}
