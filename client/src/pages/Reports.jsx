import "../styles/Reports.css";

export default function Reports() {
  return (
    <div className="reports-page">

      <h1>Reports & Analytics</h1>

      <div className="charts">

        <div className="chart-card">

          <h3>Utilization by Department</h3>

          <div className="bar-chart">

            <div className="bar b1"></div>
            <div className="bar b2"></div>
            <div className="bar b3"></div>
            <div className="bar b4"></div>
            <div className="bar b5"></div>
            <div className="bar b6"></div>

          </div>

        </div>

        <div className="chart-card">

          <h3>Maintenance Frequency</h3>

          <svg
            className="line-chart"
            viewBox="0 0 300 140"
          >
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              points="
                10,110
                50,90
                90,100
                130,60
                170,75
                210,35
                250,20
                290,15
              "
            />
          </svg>

        </div>

      </div>

      <div className="reports-grid">

        <div className="report-card">

          <h3>Most Used Assets</h3>

          <ul>

            <li>Room B2 • 34 bookings this month</li>

            <li>AF-012 • 31 allocations</li>

            <li>Projector AF-022 • 18 uses</li>

          </ul>

        </div>

        <div className="report-card">

          <h3>Idle Assets</h3>

          <ul>

            <li>Camera AF-051 • unused 60 days</li>

            <li>Chair AF-088 • unused 45 days</li>

          </ul>

        </div>

      </div>

      <div className="maintenance-card">

        <h3>
          Assets Due For Maintenance / Nearing Retirement
        </h3>

        <ul>

          <li>Laptop AF-007 • servicing due in 5 days</li>

          <li>Laptop AF-022 • 6 years old • nearing retirement</li>

        </ul>

      </div>

      <button className="success-btn">
        Export Report
      </button>

    </div>
  );
}