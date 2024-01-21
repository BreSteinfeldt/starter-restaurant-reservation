const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table not found` });
}

function tableCheck(req, res, next) {
  const {
    data: { table_name, capacity, reservation_id, occupied },
  } = req.body;
  if (!table_name || table_name == "" || table_name.length < 2) {
    return next({
      status: 400,
      message: `Table must have a name and name must be more than 2 characters`,
    });
  }
  res.locals.table = {
    table_name: table_name,
    reservation_id: reservation_id,
    capacity: capacity,
    occupied: occupied,
  };
  next();
}

async function update(req, res) {}

async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.list(date) });
}

async function create(req, res) {
  res.json({ data: await service.create(res.locals.table) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [tableCheck, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(update)],
};
