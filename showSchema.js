var pg = require('pg');

pg.defaults.ssl = true;
pg.connect('postgres://fzvidrvpjpbrcx:R6ZKMNDHXn7BQt720-WN0wbOuv@ec2-23-23-95-27.compute-1.amazonaws.com:5432/d4m7o7f3n8jirt', function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres!');

  client
    .query("select column_name, data_type, character_maximum_length from INFORMATION_SCHEMA.COLUMNS where table_name = 'PERSON';")
    .on('row', function(row) {
        console.log(JSON.stringify(row));
    });

});
