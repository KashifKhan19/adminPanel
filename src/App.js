import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { isAuthenticated } from './utils/auth';

import Dashboard from './pages/home/Dashboard';
import Header from './components/header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ProductList from './pages/products/ProductLists';
import OrderPage from './pages/Orders/OrdersPage';
import Users from './pages/customers/Users';
import AddUser from './pages/customers/Adduser';
import AddProduct from './pages/products/AddProduct';
import CategoryList from './pages/categories/CategoryList';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import EditCategory from './pages/categories/EditCategory';
import CreateCategory from './pages/categories/CreateCategory';
import CategoryProducts from './pages/categories/CategoryProducts';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './pages/ResetPassword/ResetPassword';

function App() {
  const location = useLocation();

  const noHeaderSidebarRoutes = ['/AdminLogin'];

  const shouldDisplayHeaderSidebar = isAuthenticated() && !noHeaderSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-layout">
      {shouldDisplayHeaderSidebar && <Header />}
      <div className="main-content">
        {shouldDisplayHeaderSidebar && <Sidebar />}
        <div className="content-area">
          <Routes>
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" exact={true} element={<Dashboard />} />
              <Route path="/product-list" exact={true} element={<ProductList />} />
              <Route path="/all-orders" exact={true} element={<OrderPage />} />
              <Route path="/all-users" exact={true} element={<Users />} />
              <Route path="/add-user" exact={true} element={<AddUser />} />
              <Route path="/add-product" exact={true} element={<AddProduct />} />
              <Route path="/add-category" exact={true} element={<CreateCategory />} />
              <Route path="/category/edit/:id" exact={true} element={<EditCategory />} />
              <Route path="/category/products/:Id" exact={true} element={<CategoryProducts />} />
              <Route path="/category-list" exact={true} element={<CategoryList />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
