var pg = require('pg');

console.log("DATABASE_URL:" + process.env.DATABASE_URL);
pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  // client
  //   .query('SELECT table_schema,table_name FROM information_schema.tables;')
  //   .on('row', function(row) {
  //     console.log(JSON.stringify(row));
  //   });

    client
      .query('CREATE TABLE IF NOT EXISTS testUser (id int);')
      .on('row', function(row) {
        console.log(JSON.stringify(row));
      });

  client
    .query('INSERT INTO testUser VALUES (1);')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });

    client
      .query('SELECT * FROM testUser;')
      .on('row', function(row) {
        console.log(JSON.stringify(row));
      });
});
