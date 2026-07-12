import "../styles/Notifications.css";

export default function Notifications() {

  const activities = [
    {
      type: "All",
      message: "Laptop AF-009 assigned to Priya Shah",
      time: "2m ago",
    },
    {
      type: "Alerts",
      message: "Maintenance request AF-005 approved",
      time: "15m ago",
    },
    {
      type: "Approvals",
      message: "Booking confirmed - Room B2 (2:00 PM - 3:00 PM)",
      time: "1h ago",
    },
    {
      type: "Bookings",
      message: "Transfer approved - AF-003 to Facilities Dept",
      time: "3h ago",
    },
    {
      type: "Alerts",
      message: "Overdue return - AF-002 was due 5 days ago",
      time: "1d ago",
    },
    {
      type: "All",
      message: "Audit discrepancy flagged - AF-008 damaged",
      time: "2d ago",
    },
  ];

  return (
    <div className="notifications-page">

      <h1>Activity Logs & Notifications</h1>

      <div className="filter-buttons">

        <button className="tab active">All</button>

        <button className="tab">Alerts</button>

        <button className="tab">Approvals</button>

        <button className="tab">Bookings</button>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Category</th>
              <th>Activity</th>
              <th>Time</th>
            </tr>

          </thead>

          <tbody>

            {activities.map((item, index) => (

              <tr key={index}>

                <td>{item.type}</td>

                <td>{item.message}</td>

                <td>{item.time}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}