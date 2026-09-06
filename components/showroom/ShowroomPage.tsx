import { ShowroomNav } from './ShowroomNav';
import { LiveDeck } from './LiveDeck';
import { ProjectRail } from './ProjectRail';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { ProspectLauncher } from './ProspectLauncher';

export function ShowroomPage() {
  return <main className="showroom-shell" id="main-content">
    <ShowroomNav />
    <section className="showroom-hero" aria-labelledby="showroom-title">
      <div className="hero-thesis">
        <h1 id="showroom-title">Local business.<br />Extraordinary<br /><em>first impression.</em></h1>
        <p>Your next website should feel like you. Explore six distinctive concepts, try the experience, and imagine what comes next for your business.</p>
        <a href="#work" className="showroom-primary">Find your inspiration <ArrowIcon size={19} /></a>
        <div className="hero-footnote"><span className="status-dot" />Real interactions. Ready to explore.<span>No sign-up needed.</span></div>
      </div>
      <LiveDeck />
      <div className="hero-bottom"><span>Independent design. Built around your business.</span><a href="#work">Discover the collection <span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="work" className="work-section" aria-labelledby="collection-title">
      <div className="work-heading"><h2 id="collection-title">Different worlds.<br /><em>Same attention to detail.</em></h2><p>Find a business like yours. Open the site. Book a visit, build a quote, or find a home. Every concept is yours to try.</p></div>
      <ProjectRail />
      <p className="collection-note">Fictional businesses. Real website experiences. Bookings, listings and prices are illustrative; nothing is charged or sent.</p>
    </section>
    <section id="method" className="method-section" aria-labelledby="method-title">
      <div className="method-intro"><h2 id="method-title">Made to feel right.<br /><em>Built to do more.</em></h2><p>A beautiful first impression is just the beginning. The next step should feel effortless.</p><a href="#personalize">Picture your business here <ArrowIcon size={19} /></a></div>
      <ol className="method-steps"><li><span>01</span><div><h3>Find your starting point.</h3><p>Choose the experience closest to your world. Each industry has its own personality and a different way to welcome customers.</p></div></li><li><span>02</span><div><h3>Be your own customer.</h3><p>Try the booking, the menu, the estimate. On your phone or your laptop, see how the website could work for your business.</p></div></li><li><span>03</span><div><h3>Make it unmistakably yours.</h3><p>Preview your business name, then save a project brief to discuss your brand, content and customer journey with your representative.</p></div></li></ol>
    </section>
    <ProspectLauncher />
    <section className="showroom-faq" aria-labelledby="questions-title"><h2 id="questions-title">A few things<br /><em>you might wonder.</em></h2><div>
      <details><summary>Are these real businesses?<span>+</span></summary><p>These are fictional brands created to demonstrate what a custom website can look like and how it can work. All appointments, prices, properties and confirmations are samples.</p></details>
      <details><summary>Can I try everything on my phone?<span>+</span></summary><p>Yes. Every concept includes a layout for smaller screens and a working demonstration of its main customer action. Open any demo directly on your phone.</p></details>
      <details><summary>Can you adapt a concept to my business?<span>+</span></summary><p>Your name and city can be previewed now. Your final website can be scoped around your branding, services, photography and business workflow. Save your project brief to start that conversation.</p></details>
      <details><summary>What happens when I book or request something?<span>+</span></summary><p>You will see a demonstration confirmation. No appointment is made, no payment is processed and no message is sent. Real integrations are agreed as part of your project.</p></details>
    </div></section>
    <footer className="showroom-footer"><a href="#" className="footer-wordmark" aria-label="LOCAL back to top">LOCAL<span>/</span></a><div><p>Small business.<br />Considered digital experiences.</p><a href="#work">Back to the collection <ArrowIcon size={17} /></a></div><small>Independent website concepts · 2026</small></footer>
  </main>;
}
