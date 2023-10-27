import React from 'react';

const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h4>About us</h4>
              <p>E-commerce website, where you can sell unnecessary items in your house!</p>
            </div>
            <div className="col-md-4">
              <h4>Kategorie</h4>
              <ul>
                <li><a href="#">Clothes</a></li>
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Food</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h4>Contact</h4>
              <p>Address: 123 ul. Przykładowa, Miasto</p>
              <p>Email: mwdev22@example.com</p>
              <p>Phone-number: 123-456-789</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
