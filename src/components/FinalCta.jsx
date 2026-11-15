import Link from 'next/link';

export default function FinalCta({
  title = 'Your next chapter starts with one',
  accent = 'conversation.',
  text = 'Book a free assessment and get a clear, honest plan for your visa.',
}) {
  return (
    <section className="lp-final">
      <div className="lp-final-plane" aria-hidden="true"><i className="fa-solid fa-plane"></i></div>
      <div className="container lp-final-inner" data-reveal>
        <div>
          <h2>{title} <em>{accent}</em></h2>
          <p>{text}</p>
        </div>
        <div className="lp-final-ctas">
          <Link href="/contact" className="btn btn-primary btn-lg">
            Book free assessment <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <a href="tel:+919507795077" className="btn btn-ghost btn-lg">
            <i className="fa-solid fa-phone"></i> 95077 95077
          </a>
        </div>
      </div>
    </section>
  );
}
