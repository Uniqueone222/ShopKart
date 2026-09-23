import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosCalls/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
const Home = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axiosInstance.get("/users/logout");
    setUser(null);
    navigate("/login");
  };
  const handleProfile = () =>{
    navigate("/profile")
  }
  const handleProduct = () =>{
    navigate("/products")
  }
  return (
    <div className="home-page bg-[var(--paper)]">
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
          {user ? (
            <div className="account-actions hidden items-center gap-3 sm:flex">
              <button
                className="header-login transition-colors hover:text-[var(--coral)]"
                type="button"
                onClick={handleProfile}
              >
                {user.fullName}
              </button>
              <button className="logout-button" type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <Link
              className="header-login hidden transition-colors hover:text-[var(--coral)] sm:block"
              to="/login"
            >
              Log in
            </Link>
          )}
        </div>
      </header>
      <div className="px-5 py-14 sm:px-10 lg:px-[7vw]">
        <section className="shop-intro flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Curated for you</p>
            <h1 className="text-5xl leading-[.92] sm:text-7xl">
              Small upgrades.
              <br />
              <em>Big difference.</em>
            </h1>
          </div>
          <p>
            Thoughtful things for everyday living, selected with a soft spot for
            good design.
          </p>
        </section>
        <div className="shop-toolbar mt-12 flex flex-col items-start justify-between gap-3 border-b border-[var(--line)] pb-4 lg:mt-[72px] lg:flex-row lg:items-center">
          <div className="filter-pills flex max-w-full gap-2 overflow-x-auto">
            <button
              className="active whitespace-nowrap rounded-full px-4 py-2 transition-colors"
              type="button"
            >
              All products
            </button>
            <button
              className="whitespace-nowrap rounded-full px-4 py-2 transition-colors"
              type="button"
            >
              Home
            </button>
            <button
              className="whitespace-nowrap rounded-full px-4 py-2 transition-colors"
              type="button"
            >
              Tech
            </button>
            <button
              className="whitespace-nowrap rounded-full px-4 py-2 transition-colors"
              type="button"
            >
              Wear
            </button>
          </div>
          <button className="sort-button" type="button">
            Sort: Featured ˅
          </button>
        </div>
        <section className="product-grid grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          <article className="product-card group">
            <div className="product-visual visual-coral">
              <span>01</span>
              <div className="mug-shape"></div>
            </div>
            <div className="product-info pt-4">
              <p>Home / Kitchen</p>
              <h2>Sunday mug set</h2>
              <strong>$28.00</strong>
              <button
                className="transition-colors hover:text-[var(--coral)]"
                type="button"
              >
                Add to cart <span>+</span>
              </button>
            </div>
          </article>
          <article className="product-card group">
            <div className="product-visual visual-blue">
              <span>02</span>
              <div className="lamp-shape"></div>
            </div>
            <div className="product-info">
              <p>Home / Objects</p>
              <h2>Arc desk lamp</h2>
              <strong>$64.00</strong>
              <button
                className="transition-colors hover:text-[var(--coral)]"
                type="button"
              >
                Add to cart <span>+</span>
              </button>
            </div>
          </article>
          <article className="product-card group">
            <div className="product-visual visual-yellow">
              <span>03</span>
              <div className="tote-shape">
                carry
                <br />
                well
              </div>
            </div>
            <div className="product-info">
              <p>Wear / Everyday</p>
              <h2>Canvas carry tote</h2>
              <strong>$32.00</strong>
              <button
                className="transition-colors hover:text-[var(--coral)]"
                type="button"
              >
                Add to cart <span>+</span>
              </button>
            </div>
          </article>
          <article className="product-card group">
            <div className="product-visual visual-green">
              <span>04</span>
              <div className="speaker-shape"></div>
            </div>
            <div className="product-info">
              <p>Tech / Audio</p>
              <h2>Pocket speaker</h2>
              <strong>$48.00</strong>
              <button
                className="transition-colors hover:text-[var(--coral)]"
                type="button"
              >
                Add to cart <span>+</span>
              </button>
            </div>
          </article>
        </section>
        <div className="shop-banner mt-16 flex flex-col gap-2 border-t border-[var(--line)] pt-4 sm:flex-row sm:justify-between">
          <span>Free shipping over $50</span>
          <Link to="/">Back to collection →</Link>
        </div>
      </div>
      <footer className="site-footer flex flex-wrap items-center gap-3 border-t border-[var(--line)] px-5 py-7 sm:gap-6 sm:px-10 lg:px-[76px]">
        <span>shopkart</span>
        <p>Good things, fairly priced.</p>
        <small>© 2026 ShopKart</small>
      </footer>
    </div>
  );
};

export default Home;
