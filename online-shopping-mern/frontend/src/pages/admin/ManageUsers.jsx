import { useEffect, useState } from 'react';
import api, { getError } from '../../api/axios';
import { formatDate } from '../../utils/format';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Registered users">
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <div className="form-card table-wrap">
          <table className="table align-middle">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td>{u.role}</td>
                  <td>{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
