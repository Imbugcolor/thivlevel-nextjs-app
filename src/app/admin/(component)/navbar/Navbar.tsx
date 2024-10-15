'use client'
import React from "react";
import { GoBell } from "react-icons/go";
import { CiMail } from "react-icons/ci";
import { MdOutlineMenu } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import Image from "next/image";
import { UnknowAvatar } from "@/lib/utils/unknow.avatar";
import Logo from '../../../../images/thivlevel-logo-4.png'
import { setNotify } from "@/lib/features/notifySlice";
import { userApiRequest } from "@/app/api-request/user.api";
import AdminNotification from "./notifications/AdminNotification";

export default function NavBar() {
  const user = useAppSelector(state => state.auth).user;
  const token = useAppSelector(state => state.auth).token;
  const dispatch = useAppDispatch()

  const navBarToggle = () => {
    const element = document.getElementById('sidebar')
    element?.classList.toggle('active')
  }

  const handleLogout = async () => {
    if (token) {
      dispatch(setNotify({ loading: true }))
      try {
        await userApiRequest.logOut(token, dispatch)
        dispatch(setNotify({ loading: false }))
      } catch (error) {
        dispatch(setNotify({ loading: false }))
        console.log("An unexpected error occurred:", error);
        dispatch(setNotify({ error: 'Có lỗi xảy ra' }))
      }
    }
  }

  return (
    <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
        <div className="me-3">
          <Link
            className="navbar-toggler navbar-toggler align-self-center"
            href={'/'}
          >
            <span className="icon-menu"></span>
          </Link>
        </div>
        <div>
          <Link href={'/'} className="navbar-brand brand-logo">
            <Image src={Logo} alt='logo' width={500} height={500} priority />
          </Link>
          <Link href={'/'} className="navbar-brand brand-logo-mini">
            <Image src={Logo} alt='logo' width={500} height={500} priority />
          </Link>
        </div>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-top">
        <ul className="navbar-nav">
          <li className="nav-item fw-semibold d-none d-lg-block ms-0">
            <h1 className="welcome-text">
              Good Morning, <span className="text-black fw-bold">John Doe</span>
            </h1>
            <h3 className="welcome-sub-text">
              Your performance summary this week{" "}
            </h3>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown">
            <button
              className="nav-link count-indicator"
              id="notificationDropdown"
              data-bs-toggle="dropdown"
            >
              <GoBell style={{ width: '25px', height: '25px' }} />
              <span className="count">1</span>
            </button>
            <div
              id='bell-toggle'
              className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"
              aria-labelledby="notificationDropdown"
            >
              <AdminNotification />
            </div>
          </li>
          <li className="nav-item dropdown">
            <button className="nav-link count-indicator" id="countDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <CiMail style={{ width: '25px', height: '25px' }} />
            </button>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="countDropdown">
              <button className="dropdown-item py-3">
                <p className="mb-0 fw-medium float-start">You have 7 unread mails </p>
                <span className="badge badge-pill badge-primary float-end">View all</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  Avatar
                </div>
                <div className="preview-item-content flex-grow py-2">
                  <p className="preview-subject ellipsis fw-medium text-dark">Marian Garner </p>
                  <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                </div>
              </button>
              <button className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  avatar
                </div>
                <div className="preview-item-content flex-grow py-2">
                  <p className="preview-subject ellipsis fw-medium text-dark">David Grey </p>
                  <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                </div>
              </button>
              <button className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  avatar
                </div>
                <div className="preview-item-content flex-grow py-2">
                  <p className="preview-subject ellipsis fw-medium text-dark">Travis Jenkins </p>
                  <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                </div>
              </button>
            </div>
          </li>
          <li className="nav-item dropdown d-none d-lg-block user-dropdown">
            <button
              className="nav-link"
              id="UserDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Image
                className="img-xs rounded-circle"
                src={user?.avatar || UnknowAvatar}
                alt="profile"
                width={500}
                height={500}
                priority
              />{" "}
            </button>
            <div
              id="user-dropdown-toggle"
              className="dropdown-menu dropdown-menu-right navbar-dropdown"
            >
              <div className="dropdown-header text-center">
                <Image
                  className="avatar-profile img-md rounded-circle"
                  src={user?.avatar || UnknowAvatar}
                  alt="profile"
                  width={500}
                  height={500}
                  priority
                />
                <p className="mb-1 mt-3 fw-semibold">{user?.username}</p>
                <p className="fw-light text-muted mb-0">
                  {user?.email}
                </p>
              </div>
              <button className="dropdown-item">
                <i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i>{" "}
                My Profile{" "}
                <span className="badge badge-pill badge-danger">1</span>
              </button>
              <button className="dropdown-item">
                <i className="dropdown-item-icon mdi mdi-message-text-outline text-primary me-2"></i>{" "}
                Messages
              </button>
              <button className="dropdown-item">
                <i className="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2"></i>{" "}
                Activity
              </button>
              <button className="dropdown-item">
                <i className="dropdown-item-icon mdi mdi-help-circle-outline text-primary me-2"></i>{" "}
                FAQ
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="dropdown-item-icon mdi mdi-power text-primary me-2"></i>
                Sign Out
              </button>
            </div>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          // data-bs-toggle="offcanvas"
          onClick={navBarToggle}
        >
          <MdOutlineMenu className="mdi mdi-menu" />
        </button>
      </div>
    </nav>
  );
}
