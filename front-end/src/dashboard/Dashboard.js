import React, { useEffect, useState } from "react";
import { listReservations, updateReservation } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import TablesView from "../tables/TablesView";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(query.get("date") || today());
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function clickHandler(reservation, newStatus) {
    updateReservation(reservation, newStatus)
      .then(loadDashboard)
      .catch(setReservationsError);
  }

  const nextDay = () => {
    history.push(`dashboard?date=${next(date)}`);
  };
  const prevDay = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };
  const currentDay = () => {
    history.push(`dashboard?date=${today(date)}`);
  };

  const content = reservations.map((res, i) => (
    <div key={i}>
      {res.status !== "finished" && (
        <>
          <div className="d-flex align-items-center">
            <div className="col-2">
              <p>{res.first_name}</p>
            </div>
            <div className="col-2">
              <p>{res.last_name}</p>
            </div>
            <div className="col-2">
              <p>{res.mobile_number}</p>
            </div>
            <div className="col-2">
              <p>{res.reservation_time}</p>
            </div>
            <div className="col-2">
              <p>{res.people}</p>
            </div>
            <div className="col-2">
              {res.status === "booked" && (
                <>
                  <p data-reservation-id-status={res.reservation_id}>
                    {res.status}
                  </p>
                  <a href={`/reservations/${res.reservation_id}/seat`}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => clickHandler(res, "seated")}
                    >
                      Seat
                    </button>
                  </a>
                </>
              )}
              {res.status === "seated" && (
                <>
                  <p data-reservation-id-status={res.reservation_id}>
                    {res.status}
                  </p>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      if (window.confirm("Finish reservation?"))
                        clickHandler(res, "finished");
                    }}
                  >
                    Finish
                  </button>
                </>
              )}
            </div>
          </div>
          <hr />
        </>
      )}
    </div>
  ));

  return (
    <main className="container-fluid mx-2 mt-4">
      <div className="row">
        <div className="col-8">
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0 mr-1">Reservations for date: </h4>
            <h4>{date}</h4>
          </div>
          <button
            type="button"
            className="btn btn-secondary mx-1 mb-2"
            onClick={prevDay}
          >
            Previous Day
          </button>
          <button
            type="button"
            className="btn btn-secondary mx-1 mb-2"
            onClick={currentDay}
          >
            Current Day
          </button>
          <button
            type="button"
            className="btn btn-secondary mx-1 mb-2"
            onClick={nextDay}
          >
            Next day
          </button>
          <ErrorAlert error={reservationsError} />
          <div className="d-flex">
            <div className="col-2">
              <h5>First Name</h5>
            </div>
            <div className="col-2">
              <h5>Last Name</h5>
            </div>
            <div className="col-2">
              <h5>Mobile #</h5>
            </div>
            <div className="col-2">
              <h5>Time</h5>
            </div>
            <div className="col-2">
              <h5>Seats</h5>
            </div>
            <div className="col-2">
              <h5>Status</h5>
            </div>
          </div>
          <hr />
          <div>{content}</div>
        </div>
        <div className="col-4">
          <TablesView />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
