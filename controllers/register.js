const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  // Need to make sure that registering a user and saving the login
  // are both successful. For that a rollback transaction is necessary.
  
  // Make a simple validation of the passed parameters
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  // The synchronous version of bcrypt for this function would be:
  // const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    // This is the asynchronous version of bcrypt
    bcrypt.hash(password, null, null, (err, hash) => {
      trx('login')
        .insert({
          hash: hash, 
          email: email 
        })
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .insert({
              name: name, 
              email: loginEmail[0], // because we are returning an array
              joined: new Date()
            })   
            .returning('*')
            .then(user => {
              res.json(user[0]); // because we are returning an array
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
  })
  // Don't give information about the error from knex for security
  .catch(err => res.status(400).json('unable to register'));
};

// Export the handleRegister function
module.exports = {
  handleRegister: handleRegister
};
