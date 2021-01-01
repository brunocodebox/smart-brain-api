const handleProfile = (req, res, db) => {
  const { id } = req.params;
  db('users')
  .returning('*')
  .where('id', id)
  .then(user => {
    // knex returns an empty array when a record is not found
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('not found');    
    }
  })
  .catch(err => res.status(400).json('error getting user profile'));
}

// module.exports = {
//   handleProfile: handleProfile
// }

// With ES6 no need to specify the value if same as the key
module.exports = {
  handleProfile
};