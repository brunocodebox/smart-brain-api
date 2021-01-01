// The (req, res) parameters are not physically passed but are available to the function
// and received on the stack from the caller.
const handleSignin = (db, bcrypt) => (req, res) => {
  // With post we have acces to the body in the request param
  // Don't forget to use a middleware to destructure the body as json object
  const { email, password } = req.body;

  // Make a simple validation of the passed parameters
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  // With signin we don't need to set up a transaction because we are not modifying the database
  db('login') // equivalent to db.select().from('login')
    .where('email', email) // equivalent to .where('email', '=', email)
    .then(data => {
      // the selected column or row is returned as a data object in an array
      bcrypt.compare(password, data[0].hash, (err, valid) => {
        if (valid) {
          db('users') // equivalent to db.select('*').from('users')
            .where('email', email)
            .then(user => {
              res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to signin'));
        } else {
          res.status(400).json('unable to signin');
        }
      });
    })
    // Don't give information about the error from knex for security
    .catch(err => res.status(400).json('wrong credentials'));    
}

module.exports = {
  handleSignin: handleSignin
};
