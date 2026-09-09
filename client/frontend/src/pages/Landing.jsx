import { Link, NavLink } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-page overflow-hidden">
      <header className="site-header sticky top-0 z-20 h-[78px] border-b border-[var(--line)] bg-[var(--paper)]/95 px-5 backdrop-blur sm:px-10 lg:px-[76px]">
        <Link
          className="brand transition-colors hover:text-[var(--coral)]"
          to="/"
        >
          shop<span>kart</span>
        </Link>
        <nav
          className="main-nav hidden gap-8 md:flex"
          aria-label="Main navigation"
        >
          <NavLink className="transition-colors" to="/home">
            Shop
          </NavLink>
          <a className="transition-colors" href="/#categories">
            Categories
          </a>
          <a className="transition-colors" href="/#deals">
            Deals
          </a>
        </nav>
        <div className="header-actions flex items-center gap-3 sm:gap-5">
          <button
            className="icon-button rounded-full p-1 transition-colors hover:bg-[var(--butter)]"
            type="button"
            aria-label="Search"
          >
            ⌕
          </button>
          <Link
            className="cart-link transition-colors hover:text-[var(--coral)]"
            to="/home"
            aria-label="Shopping cart"
          >
            Cart <span>0</span>
          </Link>
          <Link
            className="header-login hidden transition-colors hover:text-[var(--coral)] sm:block"
            to="/login"
          >
            Log in
          </Link>
        </div>
      </header>
      <section className="landing-hero grid min-h-[590px] items-center gap-10 px-5 py-14 sm:px-10 lg:grid-cols-2 lg:px-[10%]">
        <div className="hero-copy">
          <p className="eyebrow">A better way to browse</p>
          <h1 className="max-w-[620px] text-5xl leading-[.94] sm:text-7xl lg:text-[86px]">
            Find your next <em>favourite</em> thing.
          </h1>
          <p className="hero-text max-w-[390px] text-base leading-7">
            A considered collection of everyday pieces, clever upgrades, and
            little joys for your home and life.
          </p>
          <Link className="primary-button mt-8 inline-flex min-h-[50px] items-center justify-center gap-5 px-5 shadow-[6px_6px_0_var(--coral)] transition-transform hover:-translate-y-1" to="/home">
            Start shopping <span>→</span>
          </Link>
        </div>
        <div
          className="hero-art"
          aria-label="A selection of colorful ShopKart products"
          role="img"
        >
          <div className="art-sun"></div>
          <div className="art-card card-one">
            NEW
            <br />
            <strong>ARRIVALS</strong>
          </div>
          <div className="art-card card-two">
            soft
            <br />
            <strong>utility</strong>
          </div>
          <div className="art-orb"></div>
        </div>
      </section>
      <section className="category-strip grid grid-cols-2 border-b border-[var(--line)] lg:grid-cols-4" id="categories">
        <div className="border-b border-[var(--line)] p-6 transition-colors hover:bg-[var(--butter)] lg:border-b-0">
          <span className="category-icon text-2xl">◒</span>
          <strong>Home</strong>
          <small>Make space yours</small>
        </div>
        <div className="border-b border-[var(--line)] p-6 transition-colors hover:bg-[var(--butter)] lg:border-b-0 lg:border-r-0">
          <span className="category-icon">✦</span>
          <strong>Wear</strong>
          <small>Keep it comfortable</small>
        </div>
        <div className="p-6 transition-colors hover:bg-[var(--butter)]">
          <span className="category-icon">⌁</span>
          <strong>Tech</strong>
          <small>Smart, not flashy</small>
        </div>
        <div className="p-6 transition-colors hover:bg-[var(--butter)]">
          <span className="category-icon">♡</span>
          <strong>Gifts</strong>
          <small>For every kind of person</small>
        </div>
      </section>
      <section className="landing-note mx-auto max-w-xl px-6 py-24 text-center" id="deals">
        <p className="eyebrow">Why ShopKart</p>
        <h2 className="text-4xl leading-none sm:text-5xl">The good stuff, without the noise.</h2>
        <p>
          We look for quality, useful design, and prices that make sense. No
          endless scrolling required.
        </p>
      </section>
      <footer className="site-footer flex flex-wrap items-center gap-3 border-t border-[var(--line)] px-5 py-7 sm:gap-6 sm:px-10 lg:px-[76px]">
        <span>shopkart</span>
        <p>Good things, fairly priced.</p>
        <small>© 2026 ShopKart</small>
      </footer>
    </div>
  );
};

export default Landing;
