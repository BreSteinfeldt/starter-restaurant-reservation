const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else {
    res.json({ data: await service.list() });
  }
}

function isValid(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "No date selected" });
  const { reservation_date, reservation_time, first_name, last_name, mobile_number, people } = req.body.data;
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      return next({ status: 400, message: `Invalid input for ${field}` });
    }
  }

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
    errs.push(`Please select a valid, future date`);
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
    errs.push(`Restaurant does not open until 10:30`);
  }
  if (reservation_time > "213000") {
    goNext = true;
    errs.push(
      `Restaurant closes at 22:30, please choose a time on or before 21:30`
    );
  }
  if (goNext) return next({ status: 400, message: errs });

  res.locals.validReservation = req.body.data;
  next();
}

async function create(req, res) {
  const data = await service.create(res.locals.validReservation);
  res.status(201).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [isValid, asyncErrorBoundary(create)],
};
