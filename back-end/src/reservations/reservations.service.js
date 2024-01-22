const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .orderBy("reservation_date")
    .orderBy("reservation_time")
}

function listByDate(date){
    return knex("reservations")
     .select("reservations.*")
     .where({ reservation_date: date })
     .whereNot({ status: "finished" })
     .orderBy("reservation_time");
}

function create(reservation){
    return knex("reservations")
     .insert(reservation)
     .returning("*")
     .then((saved) => saved[0])
}

function read(reservation_id) {
  return knex("reservations")
   .where({ reservation_id: reservation_id })
   .first();
}

function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((updated) => updated[0]);
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  update,
};
