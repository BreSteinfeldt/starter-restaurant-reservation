const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

async function updatecheck(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: `No Data` });
  if (!req.body.data.reservation_id)
    return next({ status: 400, message: `no reservation_id` });
  const table = await service.read(req.params.table_id);
  const reservation = await reservationService.read(
    req.body.data.reservation_id
  );
  const errs = [];
  let goNext = false;

  if (!table) {
    goNext = true;
    errs.push(`Table not found`);
  }
  if (!reservation.length) {
    errs.push(`Reservation ${req.body.data.reservation_id} not found`);
    return next({ status: 404, message: errs.join("\n") });
  }

  if (table.occupied == true) {
    goNext = true;
    errs.push(`This table is currently occupied, select another table`);
  }
  if (reservation[0].people > table.capacity) {
    goNext = true;
    errs.push(`Reservation capacity is greater than table capacity`);
  }
  if (reservation[0].status === "seated") {
    goNext = true;
    errs.push(
      `Reservation number: ${reservation[0].reservation_id} already seated`
    );
  }
  if (goNext) {
    const errors = errs.join(" \n");
    return next({ status: 400, message: errors });
  }
  res.locals.table = table;
  res.locals.reservation_id = reservation[0].reservation_id;
  return next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    if (table.occupied === false)
    return next({ status: 400, message: `Table is not occupied` });
    return next();
  }
  return next({
    status: 404,
    message: `Table #${req.params.table_id} does not exist`,
  });
}

function tableCheck(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: `No Data` });
  let goNext = false;
  const errs = [];

  const {
    data: { table_name, capacity, reservation_id, occupied },
  } = req.body;
  if (!table_name || table_name == "" || table_name.length < 2) {
   goNext = true;
    errs.push(`table_name must be more than 2 characters`);
  }
  if (!capacity || capacity === 0 || isNaN(capacity)) {
    goNext = true;
    errs.push(`capacity invalid`);
  }
  if (goNext) {
    const errors = errs.join(" \n ");
    return next({ status: 400, message: errors });
  }
  res.locals.table = {
    table_name: table_name,
    reservation_id: reservation_id,
    capacity: capacity,
    occupied: occupied,
  };
  next();
}

async function update(req, res, next) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: res.locals.reservation_id,
    occupied: true,
  };
  await reservationService.updateStatus(res.locals.reservation_id, "seated");
  res.json({ data: await service.update(updatedTable) });
}

async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.list(date) });
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(res.locals.table) });
}

async function destroy(req, res) {
  await reservationService.updateStatus(
    res.locals.table.reservation_id,
    "finished"
  );
  res.json({ data: await service.delete(res.locals.table.table_id) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [tableCheck, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(updatecheck), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
