const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .orderBy("reservation_date")
    .orderBy("reservation_time");
}

function listByDate(date){
  return knex("reservations")
    .select("reservations.*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time"); 
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function create(reservation) {
  return knex("reservations").insert(reservation, "*");
}

function read(id) {
  return knex("reservations")
   .select("*")
   .where({ reservation_id: id });
}

function update(reservation_id, updatedReservation) {
  return knex("reservations")
  .where({ reservation_id: reservation_id })
  .update(updatedReservation)
  .returning("*");
};

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status })
    .returning("status");
};



module.exports = {
  list,
  listByDate,
  search,
  read,
  create,
  updateStatus,
  update,
};
