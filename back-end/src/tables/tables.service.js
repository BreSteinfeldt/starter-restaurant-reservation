const knex = require("../db/connection");

const list = async () => {
  return await knex("tables").select("*").orderBy("table_name");
};

function create(table){
  return knex("tables")
   .insert(table, "*");
}

function update(table_id, reservation_id) {
  return knex("tables")
  .where("table_id", table_id)
  .update({ reservation_id: reservation_id, occupied: true })
  .returning("*");
};

function read(id){
    return knex("tables")
     .select("*")
     .where({table_id: id}) 
}


function clearTable(id) {
  return knex("tables")
    .where({ table_id: id })
    .update({ reservation_id: null, occupied: false })
    .returning("*");
};

module.exports = {
  list, 
  create,
  update,
  read,
  clearTable,
};
