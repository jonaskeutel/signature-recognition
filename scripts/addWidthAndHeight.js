var pg = require('pg');

pg.defaults.ssl = true;
pg.connect('postgres://fzvidrvpjpbrcx:R6ZKMNDHXn7BQt720-WN0wbOuv@ec2-23-23-95-27.compute-1.amazonaws.com:5432/d4m7o7f3n8jirt', function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres!');

  client
    .query('ALTER TABLE SIGNATURE ADD width integer, ADD height integer;')


});
