import React from 'react';

const Footer = () => {
  return (
    <div>
      <footer className="footer">
            <div className="f-col">
              <h4>About us</h4>
              <p>E-commerce website, where you can sell unnecessary items in your house!</p>
            </div>
            <div className="f-col">
              <h4>Categories</h4>
              <ul className='lista'>
                <li><a href="/shop_center?search=clothes">Clothes</a></li>
                <li><a href="/shop_center?search=electronics">Electronics</a></li>
                <li><a href="/shop_center?search=food">Food</a></li>
              </ul>
            </div>
            <div className="f-col">
              <h4>Contact</h4>
              <span>Address: 123 ul. Przykładowa, Miasto</span>
              <span>Email: mwdev22@example.com</span>
              <span>Phone-number: 123-456-789</span>
            </div>
        </footer>
    </div>
  );
};

export default Footer;
