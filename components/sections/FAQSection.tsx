'use client'

import { useState, useCallback } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import { FAQS, type FAQItem } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Single FAQ item (accordion)
// ─────────────────────────────────────────────────────────────────────────────
function FAQAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item:     FAQItem
  index:    number
  isOpen:   boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`
        border-b transition-colors duration-200
        ${isOpen ? 'border-gold-500/30' : 'border-navy-900/15'}
      `}
    >
      {/* Question / toggle button */}
      <button
        className="
          w-full flex items-start justify-between gap-6
          py-6 text-left
          focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
          group
        "
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        {/* Number + question */}
        <div className="flex items-start gap-4">
          <span
            className={`
              font-sans text-[0.6rem] tracking-[0.22em] mt-1 flex-shrink-0
              transition-colors duration-200
              ${isOpen ? 'text-gold-600' : 'text-navy-400'}
            `}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className={`
              font-serif text-lg md:text-xl font-light leading-snug
              transition-colors duration-200
              ${isOpen ? 'text-navy-900' : 'text-navy-800 group-hover:text-navy-900'}
            `}
          >
            {item.question}
          </span>
        </div>

        {/* Expand / collapse icon */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-full
            flex items-center justify-center
            transition-all duration-300
            ${isOpen
              ? 'bg-gold-500 text-navy-900 rotate-45'
              : 'bg-navy-100 text-navy-500 group-hover:bg-navy-200'
            }
          `}
          aria-hidden="true"
        >
          <svg
            width="14" height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M7 2v10M2 7h10" />
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        className={`faq-answer ${isOpen ? 'open' : ''}`}
      >
        <div className="pl-10 pb-6 pr-14">
          <p className="font-sans text-navy-600 leading-relaxed text-[0.9375rem]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────────────
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }, [])

  // Split FAQs into two columns on desktop
  const midpoint   = Math.ceil(FAQS.length / 2)
  const leftFAQs   = FAQS.slice(0, midpoint)
  const rightFAQs  = FAQS.slice(midpoint)

  return (
    <section
      id="faq"
      className="relative bg-cream py-28 lg:py-36"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Common Questions"
          title="Everything You"
          titleItalic="Need to Know"
          subtitle="Have a question not listed here? Write to us using the contact form below."
        />

        {/* Two-column FAQ accordion on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
          {/* Left column */}
          <div>
            {leftFAQs.map((item, i) => (
              <FAQAccordionItem
                key={item.question}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>

          {/* Right column */}
          <div>
            {rightFAQs.map((item, i) => {
              const actualIndex = midpoint + i
              return (
                <FAQAccordionItem
                  key={item.question}
                  item={item}
                  index={actualIndex}
                  isOpen={openIndex === actualIndex}
                  onToggle={() => handleToggle(actualIndex)}
                />
              )
            })}
          </div>
        </div>

        {/* CTA below FAQ */}
        <div className="text-center mt-16">
          <p className="font-sans text-navy-500 text-sm mb-5">
            Still have questions? We&apos;d love to hear from you.
          </p>
          <a href="#contact" className="btn-ghost">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}
