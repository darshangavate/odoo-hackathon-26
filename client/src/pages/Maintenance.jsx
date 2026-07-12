import "../styles/Maintenance.css";

export default function Maintenance() {
  const maintenance = {
    scheduled: [
      {
        asset: "AF-012",
        title: "Dell Laptop",
        due: "12 Jul 2026",
      },
      {
        asset: "AF-021",
        title: "Conference Projector",
        due: "15 Jul 2026",
      },
    ],

    inProgress: [
      {
        asset: "AF-008",
        title: "Office Printer",
        engineer: "Rahul Patil",
      },
    ],

    completed: [
      {
        asset: "AF-003",
        title: "UPS Battery",
        date: "08 Jul 2026",
      },
      {
        asset: "AF-015",
        title: "HP Desktop",
        date: "09 Jul 2026",
      },
    ],
  };

  return (
    <div className="maintenance-page">

      <div className="maintenance-header">

        <h1>Maintenance Management</h1>

        <button className="success-btn">
          + Schedule Maintenance
        </button>

      </div>

      <div className="maintenance-board">

        <div className="maintenance-column">

          <h3>Scheduled</h3>

          {maintenance.scheduled.map((item, index) => (

            <div className="maintenance-card" key={index}>

              <h4>{item.asset}</h4>

              <p>{item.title}</p>

              <small>Due : {item.due}</small>

            </div>

          ))}

        </div>

        <div className="maintenance-column">

          <h3>In Progress</h3>

          {maintenance.inProgress.map((item, index) => (

            <div className="maintenance-card progress" key={index}>

              <h4>{item.asset}</h4>

              <p>{item.title}</p>

              <small>Engineer : {item.engineer}</small>

            </div>

          ))}

        </div>

        <div className="maintenance-column">

          <h3>Completed</h3>

          {maintenance.completed.map((item, index) => (

            <div className="maintenance-card completed" key={index}>

              <h4>{item.asset}</h4>

              <p>{item.title}</p>

              <small>Completed : {item.date}</small>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}