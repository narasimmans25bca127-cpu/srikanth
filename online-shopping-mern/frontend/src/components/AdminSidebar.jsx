import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiPlusSquare, FiList, FiUsers } from 'react-icons/fi';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <p className="admin-sidebar-title">Admin</p>
      <NavLink to="/admin" end><FiGrid /> Dashboard</NavLink>
      <NavLink to="/admin/products"><FiBox /> Manage Products</NavLink>
      <NavLink to="/admin/products/add"><FiPlusSquare /> Add Product</NavLink>
      <NavLink to="/admin/orders"><FiList /> Manage Orders</NavLink>
      <NavLink to="/admin/users"><FiUsers /> Users</NavLink>
    </aside>
  );
}
