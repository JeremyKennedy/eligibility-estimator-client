import Link from 'next/link'

export const ContactCTA = () => (
  <p>
    For a more accurate assessment, you are encouraged to{' '}
    <Link
      href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
      passHref
    >
      <a className="text-default-text underline">contact Service Canada </a>
    </Link>
    and check out the FAQ on documents you may be required to provide.
  </p>
)
