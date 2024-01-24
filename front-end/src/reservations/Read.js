import React, { useEffect, useState } from "react";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useParams } from "react-router";
import TablesView from "../tables/TablesView"; 

function Read() {
  const [reservation, setReservation] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  const { reservation_id } = useParams();

  useEffect(loadRead, [reservation_id]);

  function loadRead() {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function clickHandler(reservation, newStatus) {
    updateReservation(reservation, newStatus)
      .then(loadRead)
      .catch(setReservationsError);
  }

  return (
    <main className="container-fluid mx-2 mt-4">
      <div className="row">
        <div className="col-8">
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0 mr-1">Reservation number: {reservation_id} </h4>
          </div>
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
          <div>
            {reservation && (
              <>
                <div className="d-flex align-items-center">
                  <div className="col-2">
                    <p>{reservation.first_name}</p>
                  </div>
                  <div className="col-2">
                    <p>{reservation.last_name}</p>
                  </div>
                  <div className="col-2">
                    <p>{reservation.mobile_number}</p>
                  </div>
                  <div className="col-2">
                    <p>{reservation.reservation_time}</p>
                  </div>
                  <div className="col-2">
                    <p>{reservation.people}</p>
                  </div>
                  <div className="col-2">
                    {reservation.status === "booked" && (
                      <>
                        <p
                          data-reservation-id-status={
                            reservation.reservation_id
                          }
                        >
                          {reservation.status}
                        </p>
                        <a
                          name="seat"
                          id="seat"
                          href={`/reservations/${reservation.reservation_id}/seat`}
                        >
                          <button
                            name="seat"
                            id="seat"
                            type="button"
                            className="btn btn-primary"
                            onClick={() => clickHandler(reservation, "seated")}
                          >
                            Seat
                          </button>
                        </a>
                      </>
                    )}
                    {reservation.status === "seated" && (
                      <>
                        <p
                          data-reservation-id-status={
                            reservation.reservation_id
                          }
                        >
                          {reservation.status}
                        </p>
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() => {
                            if (window.confirm("Finish reservation?"))
                              clickHandler(reservation, "finished");
                          }}
                        >
                          Finish
                        </button>
                      </>
                    )}
                    <a
                      href={`/reservations/${reservation.reservation_id}/edit`}
                    >
                      <button type="button" className="btn btn-secondary ml-2">
                        Edit
                      </button>
                    </a>
                  </div>
                </div>
                <hr />
              </>
            )}
          </div>
        </div>
        <div className="col-4">
          <TablesView />
        </div>
      </div>
    </main>
  );
}

export default Read;