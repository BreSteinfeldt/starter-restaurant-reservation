const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
    res.json({ data: await service.list(date) });
}

function isValid(req, res, next) {
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
  const errs = [];
  let goNext = false;
  if (!first_name || first_name == "") {
    goNext = true;
    errs.push(`First name is required`);
  }
  if (!last_name || last_name == "") {
    goNext = true;
    errs.push(`Last name is required`);
  }
  if (!mobile_number || mobile_number == "" || isNaN(Number(mobile_number))) {
    goNext = true;
    errs.push(`Mobile number is required`);
  }
  if (!reservation_date || reservation_date == "") {
    goNext = true;
    errs.push(`Please select a reservation date`);
  }
  if (submitDate < today) {
    goNext = true;
    errs.push(`Please select a valid, future date and time`);
  }
  if (submitDate.getDay() === 2) {
    goNext = true;
    errs.push(`Restaurant is closed on Tuesdays`);
  }
  if (!reservation_time) {
    goNext = true;
    errs.push(`Please select a reservation time`);
  }
  if (reservation_time < "103000") {
    goNext = true;
    errs.push(
      `Restaurant does not open until 10:30, please choose a time after opening`
    );
  }
  if (reservation_time > "213000") {
    goNext = true;
    errs.push(
      `Restaurant closes at 22:30, please choose a time on or before 21:30`
    );
  }
  if (goNext) return next({ status: 400, message: errs });
  res.locals.reservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  };
  next();
  return next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({ status: 400, message: [`Reservation not found`] });
}

async function update(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  res.json({ data: await service.update(updatedReservation) });
}

async function create(req, res) {
  const data = await service.create(res.locals.reservation);
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
  list: [asyncErrorBoundary(queryChecker), asyncErrorBoundary(list)],
  create: [isValid, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)],
};
