'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { CtaButton } from './cta-button';
import type { LeadDetails } from './types';

const CHECKBOX_ID = 'receiveGiftTop';

const INPUT_CLASS =
  'w-full px-3 py-3 rounded-xl border-2 border-[#2f343a]/30 bg-[#0a0c0d] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4fd12f] focus:border-[#4fd12f]';

export function OptInForm({ onSubmit }: { onSubmit: (lead: LeadDetails) => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+46');
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
    <div className="w-full rounded-2xl border border-[#2f343a]/70 bg-[#0f1113]/85 p-6 sm:p-8 shadow-md">
        <h2 className="mb-6 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
          VART SKICKAR VI DIN TILLGÅNG?
        </h2>

        <form id={`${CHECKBOX_ID}-form`} onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Ditt fullständiga namn här..."
            className={INPUT_CLASS}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div className="relative">
            <input
              type="email"
              required
              data-whop-tracked="email"
              placeholder="Din e-postadress här...*"
              className="w-full py-3 pl-3 pr-11 rounded-xl border-2 border-[#2f343a]/30 bg-[#0a0c0d] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4fd12f] focus:border-[#4fd12f]"
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
              country="se"
              value={phone}
              onChange={setPhone}
              specialLabel="Telefon"
              placeholder="Telefonnummer"
              inputProps={{
                type: 'tel',
                required: !declinePhone,
                'data-whop-tracked': 'phone',
              }}
              inputClass="w-full px-4 py-3 rounded-md border border-[#2f343a] bg-[#0a0c0d] pl-12 text-white font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4fd12f] focus:border-[#4fd12f]"
              buttonStyle={{
                backgroundColor: 'rgb(11, 15, 16)',
                color: 'white',
                border: '1px solid rgb(95, 214, 62)',
              }}
            />
          </div>

          <div className="flex items-start gap-3 py-1">
            <input
              id={CHECKBOX_ID}
              type="checkbox"
              checked={declinePhone}
              onChange={(e) => setDeclinePhone(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-[#4fd12f] bg-[#0a0c0d] text-[#4fd12f] focus:ring-[#4fd12f] focus:ring-2"
            />
            <label
              htmlFor={CHECKBOX_ID}
              className="cursor-pointer text-xs font-medium leading-snug text-white/75 sm:text-sm"
            >
              🎁 Jag vill inte dela mitt telefonnummer och missar chansen att vinna en MacBook,
              iPhone eller 1 000 $
            </label>
          </div>

          <p className="text-[9px] sm:text-[10px] text-gray-500 text-center leading-tight">
            Genom att ange ditt telefonnummer godkänner du att vi skickar sms om ditt
            samtal. Svara STOP när som helst för att avsluta.
          </p>

          <CtaButton
            type="submit"
            primaryLabel="BOKA ETT SAMTAL"
            secondaryLabel="FÅ GRATIS TILLGÅNG TILL VÅR 1-TIMMESKURS"
          />

          <p className="text-center text-sm text-gray-500">
            🔒 Vi värnar om din integritet. Aldrig spam.
          </p>
      </form>
    </div>
  );
}
