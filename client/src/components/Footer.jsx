import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-800 text-white px-6 py-4 text-center space-y-4">
      <h3 className="font-bold text-lg">Watchstock</h3>
      <div className="space-x-4">
        <a href="/" className="text-orange-600 hover:text-orange-500">
          Home
        </a>
        <a href="/about" className="text-orange-600 hover:text-orange-500">
          About Us
        </a>
        <a href="/contact" className="text-orange-600 hover:text-orange-500">
          Contact
        </a>
        <a href="/services" className="text-orange-600 hover:text-orange-500">
          Services
        </a>
        <a
          href="/privacy-policy"
          className="text-orange-600 hover:text-orange-500"
        >
          Privacy Policy
        </a>
      </div>
      <p>{currentYear} © All rights reserved by tententgc</p>
    </footer>
  );
};

export default Footer;
