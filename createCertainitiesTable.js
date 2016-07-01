var pg = require('pg');

pg.defaults.ssl = true;
pg.connect('postgres://fzvidrvpjpbrcx:R6ZKMNDHXn7BQt720-WN0wbOuv@ec2-23-23-95-27.compute-1.amazonaws.com:5432/d4m7o7f3n8jirt', function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('CREATE TABLE IF NOT EXISTS certainities (personID real, xCertainity real, xCertainityWorst real, xCertainitySliced real, xCertainitySlicedWorst real, yCertainity real, yCertainityWorst real, yCertainitySliced real, yCertainitySlicedWorst real, forceCertainity real, forceCertainityWorst real, accelerationCertainity real, accelerationCertainityWorst real, orientationCertainity real, orientationCertainityWorst real, widthCertainity real, widthCertainityWorst real, heightCertainity real, heightCertainityWorst real, durationCertainity real, durationCertainityWorst real, numStrokesCertainity real, numStrokesCertainityWorst real);')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
