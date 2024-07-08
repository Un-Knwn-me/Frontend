import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import ForgotPassword from './components/login/ForgetPassword';
import ContactAdmin from './components/login/ContactAdmin';
import Main from './components/layout/Main';
import Dashboard from './components/dashboard/Dashboard';
import Permissions from './components/admin/Permissions';
import Users from './components/admin/Users';
import ProductMaster from './components/products/ProductMaster';
import AddProducts from './components/products/add-products/AddProducts';
import StockIn from './components/stocks/stock-in/StockIn';
import WithPo from './components/purchase/with-po/WithPo';
import WithoutPo from './components/purchase/without-po/WithoutPo';
import Reports from './components/reports/Reports';
import Profile from './components/profile/Profile';
import StockOut from './components/stocks/stock-out/stockOut';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact-admin" element={<ContactAdmin />} />

          <Route path="/main" element={<Main />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="users" element={<Users />} />
            <Route path='product-master' element={<ProductMaster />} />
            <Route path='add-products' element={<AddProducts />} />
            <Route path='stock-in' element={<StockIn />} />
            <Route path='stock-out' element={<StockOut />} />
            <Route path='withpo' element={<WithPo />} />
            <Route path='withoutpo' element={<WithoutPo />} />
            <Route path="report" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
