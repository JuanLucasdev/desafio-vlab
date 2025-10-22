import React from "react";
import { BookOpen } from "lucide-react";

const Navbar = () => (
  <header className="navbar-header">
    <div className="navbar-content">
      <div className="brand">
        <BookOpen className="brand-icon" />
        <span className="brand-name">CourseSphere</span>
      </div>

      <div className="nav-links">
        <a href="#">Explore</a>
        <a href="#">Plans & Pricing</a>
        <a href="#">Business</a>
        <button className="btn-login">Log In</button>
        <button className="btn-signup">Sign Up</button>
      </div>
    </div>
  </header>
);

export default Navbar;
