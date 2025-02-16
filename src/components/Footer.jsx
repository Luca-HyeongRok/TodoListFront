import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Luca.J. All rights reserved.</p>
      <p>
        문의: <a href="mailto:hr.jeon28@gmail.com">contact@lucaj.com</a>
      </p>
      <p>주소: 서울특별시 강남구 테헤란로</p>
    </footer>
  );
};

export default Footer;
