import { ORDER_STATUSES } from '../utils/format';

export default function OrderTracker({ status }) {
  const current = ORDER_STATUSES.indexOf(status);

  return (
    <ol className="tracker" aria-label={`Order status: ${status}`}>
      {ORDER_STATUSES.map((step, index) => (
        <li
          key={step}
          className={index < current ? 'done' : index === current ? 'current' : ''}
        >
          <span className="tracker-dot" />
          <span className="tracker-label">{step}</span>
        </li>
      ))}
    </ol>
  );
}
