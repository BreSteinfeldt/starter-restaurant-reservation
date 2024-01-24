const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) res.json({ data: await service.list(date) });
  else if (mobile_number)
    res.json({ data: await service.search(mobile_number) });
  else res.json({ data: await service.list() });
}

function isValid(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: `No Data` });
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    },
  } = req.body;
  const today = Date.now();
  const submitDate = new Date(reservation_date + " " + reservation_time);
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  const timeFormat = /\d\d:\d\d/;
  const errs = [];
  let goNext = false;

  if (!first_name || first_name == "") {
    goNext = true;
    errs.push(`first_name is invalid. First name is required.`);
  }
  if (!last_name || last_name == "") {
    goNext = true;
    errs.push(`last_name is invalid. Last name is required.`);
  }
  if (!mobile_number || mobile_number == "") {
    goNext = true;
    errs.push(`mobile_number is invalid. Mobile number is required.`);
  }
  if (
    !reservation_date ||
    reservation_date == "" ||
    !reservation_date.match(dateFormat)
  ) {
    goNext = true;
    errs.push(`reservation_date is invalid. Please select a reservation date.`);
  }
  if (submitDate < today) {
    goNext = true;
    errs.push(
      `reservation_date is invalid. Please select a valid, future date and time.`
    );
  }
  if (submitDate.getDay() === 2) {
    goNext = true;
    errs.push(`reservation_date is invalid. Restaurant is closed on Tuesdays.`);
  }
  if (!reservation_time || !reservation_time.match(timeFormat)) {
    goNext = true;
    errs.push(`reservation_time is invalid. Please select a reservation time.`);
  }
  if (reservation_time < "103000") {
    goNext = true;
    errs.push(
      `reservation_time is invalid. Restaurant does not open until 10:30, please choose a time after opening.`
    );
  }
  if (reservation_time > "213000") {
    goNext = true;
    errs.push(
      `reservation_time is invalid. Restaurant closes at 22:30, please choose a time on or before 21:30.`
    );
  }
  if (!people || people === 0 || typeof people !== "number") {
    goNext = true;
    errs.push(`people size is invalid.`);
  }
  if (status == "seated" || status == "finished") {
    goNext = true;
    errs.push(`status cannot be "seated" or "finished"`);
  }
  if (goNext) {
    const errors = errs.join(" \n");
    return next({ status: 400, message: errors });
  }
  res.locals.validReservation = {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  };
  return next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (!reservation.length) {
    return next({
      status: 404,
      message: `Reservation ${req.params.reservation_id} not found`,
    });
  }
  res.locals.reservation = reservation[0];
  return next();
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function update(req, res, next) {
  if (
    req.body.data.status !== "seated" &&
    req.body.data.status !== "finished" &&
    req.body.data.status !== "booked" &&
    req.body.data.status !== "cancelled"
  )
    return next({
      status: 400,
      message: `status "${req.body.data.status}" is invalid`,
    });
  if (res.locals.reservation.status === "finished")
    return next({
      status: 400,
      message: `a finished reservation cannot be updated`,
    });
  res.json({
    data: await service.updateStatus(
      res.locals.reservation.reservation_id,
      req.body.data.status
    ),
  });
}

async function edit(req, res) {
  // const updatedReservation = {
  //   ...res.locals.validReservation,
  //   reservation_id: res.locals.validReservation.reservation_id,
  // };
  res.json({ data: await service.update(res.locals.validReservation) });
}

async function create(req, res) {
  const data = await service.create(res.locals.validReservation);
  res.status(201).json({ data });
}

function queryChecker(req, res, next) {
  const { mobile_phone } = req.query;
  if (mobile_phone) {
    res.locals.mobile_number = mobile_phone;
    return search(req, res);
  } else return next();
}

async function search(req, res) {
  res.json({ data: await service.search(res.locals.mobile_number) });
}

module.exports = {
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(queryChecker), asyncErrorBoundary(list)],
  create: [isValid, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)],
  edit: [
    asyncErrorBoundary(reservationExists),
    isValid,
    asyncErrorBoundary(edit),
  ],
};
