// import 'animate.css';
import { ConfigProvider, notification } from 'antd';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { lazy, Suspense } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import './App.css';
import Loading from './components/general/Loading';
import PrivateRoute from './components/general/PrivateRoute';
import { COLORS } from './constants/color';
import { ROUTES } from './constants/routers';

const DefaultLayout = lazy(() => import('./components/layout/DefaultLayout'));
const AuthLayout = lazy(() => import('./components/layout/AuthLayout'));
const Login = lazy(() => import('./pages/login'));
const NotFound = lazy(() => import('./components/general/PageNotFound'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Customers = lazy(() => import('./pages/customers'));
const PointAndCoupons = lazy(() => import('./pages/point-and-coupons'));
const Campaign = lazy(() => import('./pages/campaign'));
const ReportAndAnalytics = lazy(() => import('./pages/report-and-analytics'));
const Staff = lazy(() => import('./pages/staff'));
const Notification = lazy(() => import('./pages/notification'));
const GasStation = lazy(() => import('./pages/gas-station'));
const Setting = lazy(() => import('./pages/setting'));

function App() {
  // useSocket();

  notification.config({
    duration: 4, // Thời gian đóng mặc định (tính bằng giây)
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.primary,
          borderRadius: 8,
        },
        components: {
          Menu: {
            darkItemSelectedBg: COLORS.darkMenuItemBg,
          }
        }
      }}
    >
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Những route cần bọc private route để xử lí logic */}
              {/* Những route cần bọc Default Layout */}
              <Route
                element={
                  <PrivateRoute>
                    <DefaultLayout />
                  </PrivateRoute>
                }
              >
                <Route
                  index
                  element={<Navigate to={ROUTES.DASHBOARD} replace />}
                />
                <Route
                  path={ROUTES.DASHBOARD}
                  element={<Dashboard />}
                />
                <Route
                  path={ROUTES.CUSTOMERS}
                  element={<Customers />}
                />
                <Route
                  path={ROUTES.POINTANDCOUPONS}
                  element={<PointAndCoupons />}
                />
                <Route
                  path={ROUTES.CAMPAIGN}
                  element={<Campaign />}
                />
                <Route
                  path={ROUTES.REPORTANDANALYTICS}
                  element={<ReportAndAnalytics />}
                />
                <Route
                  path={ROUTES.STAFF}
                  element={<Staff />}
                />
                <Route
                  path={ROUTES.NOTIFICATION}
                  element={<Notification />}
                />
                <Route
                  path={ROUTES.GASSTATION}
                  element={<GasStation />}
                />
                <Route
                  path={ROUTES.SETTING}
                  element={<Setting />}
                />
              </Route>
              {/* Những route cần bọc Auth Layout */}
              <Route
                element={
                  <PrivateRoute isPublicOnly={true}>
                    <AuthLayout />
                  </PrivateRoute>
                }
              >
                <Route
                  path={ROUTES.LOGIN}
                  element={<Login />}
                />
              </Route>

              {/* Những route không cần bọc private route */}
              <Route
                path="*"
                element={
                    <NotFound />
                }
              />
              
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;
