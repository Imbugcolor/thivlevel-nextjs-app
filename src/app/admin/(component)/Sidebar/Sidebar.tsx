'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { navItems, navLinks } from "./navData";

export default function SideBar() {
  const pathname = usePathname()
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className={`nav-item ${pathname === navItems.charts && 'active'}`}>
          <Link href={navLinks.charts} className="nav-link">
            <i className="mdi mdi-grid-large menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item nav-category">Features</li>
        <li className={`nav-item ${pathname === navItems.users && 'active'}`}>
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#ui-basic"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <i className="menu-icon mdi mdi-floor-plan"></i>
            <span className="menu-title">Người dùng</span>
            <i className="menu-arrow">
              <FaAngleDown />
            </i>
          </a>
          <div className="collapse" id="ui-basic">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link href={navLinks.users} className={`nav-link ${pathname === navLinks.users && 'active'}`}>
                  Danh sách
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className={`nav-item ${pathname === navItems.products && 'active'}`}>
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#form-elements"
            aria-expanded="false"
            aria-controls="form-elements"
          >
            <i className="menu-icon mdi mdi-card-text-outline"></i>
            <span className="menu-title">Sản phẩm</span>
            <i className="menu-arrow">
              <FaAngleDown />
            </i>
          </a>
          <div className="collapse" id="form-elements">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link href={navLinks.products} className={`nav-link ${pathname === navLinks.products && 'active'}`}>
                  Danh sách
                </Link>
              </li>
              <li className="nav-item">
                <Link href={navLinks.createProduct} className={`nav-link ${pathname === navLinks.createProduct && 'active'}`}>
                  Tạo sản phẩm
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className={`nav-item ${pathname === navItems.categories && 'active'}`}>
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#icons"
            aria-expanded="false"
            aria-controls="icons"
          >
            <i className="menu-icon mdi mdi-layers-outline"></i>
            <span className="menu-title">Danh mục</span>
            <i className="menu-arrow">
              <FaAngleDown />
            </i>
          </a>
          <div className="collapse" id="icons">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link className={`nav-link ${pathname === navLinks.categories && 'active'}`} href={navLinks.categories}>
                  Danh sách
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className={`nav-item ${pathname === navItems.orders && 'active'}`}>
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#tables"
            aria-expanded="false"
            aria-controls="tables"
          >
            <i className="menu-icon mdi mdi-table"></i>
            <span className="menu-title">Đơn hàng</span>
            <i className="menu-arrow">
              <FaAngleDown />
            </i>
          </a>
          <div className="collapse" id="tables">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link className={`nav-link ${pathname === navLinks.orders && 'active'}`} href={navLinks.orders}>
                  Danh sách
                </Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  );
}
