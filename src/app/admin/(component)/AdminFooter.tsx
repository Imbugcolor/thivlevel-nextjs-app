import React from "react";

export default function AdminFooter() {
  return (
    <footer className="footer">
      <div className="d-sm-flex justify-content-center justify-content-sm-between">
        <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
          Thivlevel{" "}
          <a
            href="https://www.bootstrapdash.com/"
            target="_blank"
            rel="noreferrer"
          >
            Admin Dashboard for managerment
          </a>{" "}
          from Thivlevel.
        </span>
        <span className="float-none float-sm-end d-block mt-1 mt-sm-0 text-center">
          Copyright © 2023. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
