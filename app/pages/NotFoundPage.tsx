import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="center-screen">
      <div className="not-found">
        <h1>404</h1>
        <p>Halaman tidak ditemukan.</p>
        <Link className="btn btn-primary" to="/">
          Kembali
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
