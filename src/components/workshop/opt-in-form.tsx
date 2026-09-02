'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { CtaButton } from './cta-button';
import type { LeadDetails } from './types';

const CHECKBOX_ID = 'receiveGiftTop';

const INPUT_CLASS =
  'w-full px-3 py-3 rounded-xl border-2 border-[#2a6b85]/30 bg-[#0b0f10] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38a3b8] focus:border-[#38a3b8]';

export function OptInForm({ onSubmit }: { onSubmit: (lead: LeadDetails) => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1');
  // Inverted opt-out: checking it means "don't share my phone".
  const [declinePhone, setDeclinePhone] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: declinePhone ? '' : phone,
      declinedPhone: declinePhone,
    });
  };

  return (
    <div className="w-full rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 p-6 sm:p-8 shadow-md">
        <h2 className="mb-6 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
          CLAIM YOUR FREE SPOT NOW
        </h2>

        <form id={`${CHECKBOX_ID}-form`} onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Your Full Name Here..."
            className={INPUT_CLASS}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div className="relative">
            <input
              type="email"
              required
              data-whop-tracked="email"
              placeholder="Your Email Address Here...*"
              className="w-full py-3 pl-3 pr-11 rounded-xl border-2 border-[#2a6b85]/30 bg-[#0b0f10] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38a3b8] focus:border-[#38a3b8]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            />
          </div>

          <div className="phone-input-container">
            <PhoneInput
              country="us"
              value={phone}
              onChange={setPhone}
              specialLabel="Phone"
              placeholder="Phone Number"
              inputProps={{
                type: 'tel',
                required: !declinePhone,
                'data-whop-tracked': 'phone',
              }}
              inputClass="w-full px-4 py-3 rounded-md border border-[#2a6b85] bg-[#0b0f10] pl-12 text-white font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38a3b8] focus:border-[#38a3b8]"
              buttonStyle={{
                backgroundColor: 'rgb(11, 15, 16)',
                color: 'white',
                border: '1px solid rgb(42, 107, 133)',
              }}
            />
          </div>

          <div className="flex items-start gap-3 py-1">
            <input
              id={CHECKBOX_ID}
              type="checkbox"
              checked={declinePhone}
              onChange={(e) => setDeclinePhone(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-[#38a3b8] bg-[#0b0f10] text-[#38a3b8] focus:ring-[#38a3b8] focus:ring-2"
            />
            <label
              htmlFor={CHECKBOX_ID}
              className="cursor-pointer text-xs font-medium leading-snug text-white/75 sm:text-sm"
            >
              🎁 I don&apos;t want to share my phone and will miss out on a chance to win a MacBook,
              iPhone or $1000
            </label>
          </div>

          <p className="text-[9px] sm:text-[10px] text-gray-500 text-center leading-tight">
            By providing your phone number, you consent to receive SMS messages about joining the
            webinar. You may reply STOP at any time to unsubscribe.
          </p>

          <CtaButton
            type="submit"
            primaryLabel="BOOK MY CALL"
            secondaryLabel="WORKSHOP STARTING 8PM EST TONIGHT"
          />

          <div className="pt-2 text-center">
            <p className="mx-auto max-w-md text-[10px] font-normal leading-relaxed sm:max-w-none sm:whitespace-nowrap sm:text-[11px] text-white/80">
              When you attend the event, we will ❤️ donate a meal to someone in need in your name.
            </p>
            <Image
              src="/images/aia-assets/charity-badge.avif"
              alt="Meal donation badge"
              width={220}
              height={110}
              className="mx-auto mt-2 h-auto w-28 sm:w-36"
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            🔒 We respect your privacy. No spam, ever.
          </p>
      </form>
    </div>
  );
}
