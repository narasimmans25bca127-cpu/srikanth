// To change the currency, edit this one function.
export const formatPrice = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];
