import React from "react";

const SocialButton = ({ icon: Icon, label, onClick }) => {
  const handleClick = onClick || (() => console.log(`Tentando login com ${label}`));
  return (
    <button
      onClick={handleClick}
      className="btn-social"
      aria-label={`Login with ${label}`}
    >
      <Icon className="social-icon" />
      <span>{label}</span>
    </button>
  );
};

export default SocialButton;
