var pg = require('pg');

pg.defaults.ssl = true;
pg.connect('postgres://fzvidrvpjpbrcx:R6ZKMNDHXn7BQt720-WN0wbOuv@ec2-23-23-95-27.compute-1.amazonaws.com:5432/d4m7o7f3n8jirt', function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres!');

  console.log("Persons: ");
  client
    .query('SELECT * FROM PERSON;')
    .on('row', function(row) {
        console.log(JSON.stringify(row));
    });

  client
    .query('SELECT * FROM SIGNATURE')
    .on('row', function(row) {
      console.log(row.duration);
      console.log("PersonId: " +  row.personId);
      console.log("Duration: " + row.duration);
      console.log("x-values: " + row.x);
      console.log("y-values: " + row.y);
      console.log("force: " + row.force);
      console.log("acceleration: " + row.acceleration);
      console.log("gyroscope: " + row.gyroscope);
      console.log("width: " + row.width);
      console.log("height: " + row.height);

    });

});
