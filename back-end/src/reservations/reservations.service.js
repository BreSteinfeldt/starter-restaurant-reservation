const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((saved) => saved[0]);
}

function read(resId) {
  return knex("reservations")
   .where({ reservation_id: resId });
}

function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((updated) => updated[0]);
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status }, "*")
    .then((updated) => updated[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  update,
  updateStatus,
  search,
};
