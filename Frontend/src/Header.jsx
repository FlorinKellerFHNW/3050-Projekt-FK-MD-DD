export function Header() {
  return (
    <header className="header">
      <div className="header-info">
        <div className="header-school">FHNW</div>
        <div>3050 Webprogrammierung und <br /> interaktive Datenvisualisierung</div>
      </div>

      <h1 className="header-title">Passantenfrequenzen Bahnhofstrasse Zürich</h1>

      <img src="/logo-fhnw.jpg" alt="Logo der FHNW" className="header-logo" />
    </header>
  )
}

export default Header
