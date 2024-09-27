import '../../assets/css/style.css'
import './dashboard.css'
import { Metadata } from 'next';
import Script from 'next/script';
import AdminFooter from '../(component)/AdminFooter';
import NavBar from '../(component)/navbar/Navbar';
import SideBar from '../(component)/Sidebar/Sidebar';

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Clothing store for you",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="container-scroller">
        {/* <!-- partial:partials/_navbar.html --> */}
        <NavBar />
        {/* <!-- partial --> */}
        <div className="container-fluid page-body-wrapper">
          {/* <!-- partial:partials/_sidebar.html --> */}
          <SideBar />
          {/* <!-- partial --> */}
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="row">
                <div className="col-sm-12 px-3">
                  {children}
                </div>
              </div>
            </div>
            {/* <!-- content-wrapper ends --> */}
            {/* <!-- partial:partials/_footer.html --> */}
            <AdminFooter />
            {/* <!-- partial --> */}
          </div>
          {/* <!-- main-panel ends --> */}
        </div>
        {/* <!-- page-body-wrapper ends --> */}
      </div>

      {/* <!-- container-scroller --> */}
      {/* <!-- plugins:js --> */}
      <Script src="/assets/vendors/js/vendor.bundle.base.js" />
      <Script src="/assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js" />
      {/* <!-- endinject --> */}
      {/* <!-- Plugin js for this page --> */}
      <Script src="/assets/vendors/chart.js/chart.umd.js" />
      <Script src="/assets/vendors/progressbar.js/progressbar.min.js" />
      {/* <!-- End plugin js for this page --> */}
      {/* <!-- inject:js --> */}
      <Script src="/assets/js/off-canvas.js" />
      <Script src="/assets/js/template.js" />
      <Script src="/assets/js/settings.js" />
      <Script src="/assets/js/hoverable-collapse.js" />
      <Script src="/assets/js/todolist.js" />
      {/* <!-- endinject --> */}
      {/* <!-- Custom js for this page--> */}
      <Script src="/assets/js/jquery.cookie.js" type="text/javascript" />
      <Script src="/assets/js/dashboard.js" />
      {/* <!-- <script src="assets/js/Chart.roundedBarCharts.js"></script> --> */}
      {/* <!-- End custom js for this page--> */}
    </>
  );
}
