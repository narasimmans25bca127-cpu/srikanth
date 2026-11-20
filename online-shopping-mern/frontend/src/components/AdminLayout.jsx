import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ title, action, children }) {
  return (
    <div className="container admin-layout">
      <AdminSidebar />
      <section className="admin-content">
        <div className="admin-head">
          <h1>{title}</h1>
          {action}
        </div>
        {children}
      </section>
    </div>
  );
}
