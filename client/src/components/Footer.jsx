import React from "react";
import Contact from '../pages/contact/contact';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-800 text-white px-6 py-4 text-center space-y-4">
      <h3 className="font-bold text-lg">Watchstock</h3>
      <div className="space-x-4">
        <a href="/" className="text-orange-600 hover:text-orange-500">
          Home
        </a>
        <a href="/feed" className="text-orange-600 hover:text-orange-500">
          All Collection 
        </a>
        <a href="/request" className="text-orange-600 hover:text-orange-500">
          Request
        </a>
        <a href="/contact" className="text-orange-600 hover:text-orange-500">
          Contact
        </a>
        <a
          href="https://www.tententgc.com"
          className="text-orange-600 hover:text-orange-500"
        >
          About me
        </a>
      </div>
      <p>{currentYear} © All rights reserved by tententgc</p>
    </footer>
  );
};

export default Footer;
