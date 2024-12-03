import './Logo.css';  // Import the CSS file

function Logo({setView}) {
  const handleLogoClick = () => {
    setView({type: 'home', id: null});
  }

  return (
    <div className="logo-container" onClick={handleLogoClick}>
      <img
        src="https://cdn.simpleicons.org/reddit/FF4500"
        alt="Reddit Icon"
        id="reddit-icon"
      />
      <h1 id="app-name">
        <a href="/" onClick={(e) => {e.preventDefault(); setView({type: 'home', id: null})} }>Phreddit</a>
      </h1>
    </div>
  );
}

export default Logo;