function Footer() {
  return (
    <footer
      style={{
        marginTop: "50px",
        padding: "20px",
        textAlign: "center",
        background: "linear-gradient(90deg, #3b82f6, #6366f1)",
        color: "white",
        fontSize: "14px",
      }}
    >
      © {new Date().getFullYear()} TravelCircle. Designed & Developed by Swarup Gonte.
    </footer>
  );
}

export default Footer;
