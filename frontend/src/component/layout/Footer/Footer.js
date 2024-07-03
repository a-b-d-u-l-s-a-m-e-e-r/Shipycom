import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>Shipycom.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2023 &copy; AbdulSameer</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/sheikh_abdul_sameer/">Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=100011599651883">Facebook</a>
        <a href="https://www.linkedin.com/in/abdul-sameer-475132202/">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
