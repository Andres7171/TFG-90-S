import { Search, User } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import "./../styles/Header.css";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
     <div className="contenedor">
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="header border-bottom py-2 px-4"
    >
      <div className="container-fluid">
        <div className="row align-items-center">

          <div className="col-3">
            <h1 className="logo-text m-2">
              90'S TYPE SHIT
            </h1>
          </div>

          <div className="col-8 position-relative">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field w-100"
            />
          </div>

          {/* USER → 1 columna */}
          <div className="col-1 text-end">
            <button className="user-btn-round">
              <User size={20} />
            </button>
          </div>

        </div>
      </div>
    </motion.header>
    </div>
  );
}