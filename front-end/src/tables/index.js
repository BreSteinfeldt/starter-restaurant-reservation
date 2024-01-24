import { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";

export default function Table({
  initialState = {
    table_name: "",
    reservation_id: null,
    capacity: 0,
    occupied: false,
  },
}) {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [table, setTable] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function cancel() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    createTable(table)
      .then(() => history.push(`/dashboard`))
      .catch(setErrorMessage);
  }

  return (
    <main className="container-fluid mt-3">
      <form onSubmit={submitHandler}>
        <h1 className="mx-2 mt-4">Create a Table</h1>
        {errorMessage && (
          <div className="alert alert-danger">
            <h4>Please fix the following errors: </h4>
            <p>{errorMessage.message}</p>
          </div>
        )}
        <fieldset className="mt-3">
          <div className="form-group">
            <label htmlFor="table_name" className="m-2">
              Table Name:
            </label>
            <input
              type="text"
              placeholder="Table"
              name="table_name"
              id="table_name"
              required={true}
              value={table.table_name}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacity" className="m-2">
              Capacity:
            </label>
            <input
              type="number"
              placeholder="Minimum 1"
              min="0"
              max="20"
              name="capacity"
              id="capacity"
              required={true}
              value={table.capacity}
              onChange={changeHandler}
            />
          </div>
          <button
            type="button"
            className="btn btn-danger mx-2"
            onClick={cancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary mx-2">
            Submit
          </button>
        </fieldset>
      </form>
    </main>
  );
}