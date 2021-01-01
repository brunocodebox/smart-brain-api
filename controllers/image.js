const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.API_KEY
});

const handleApiCall = (req, res) => {
  const { input } = req.body;

  app.models.predict(
    Clarifai.FACE_DETECT_MODEL, 
    //Clarifai.GENERAL_MODEL,
    // May have to change FACE_DETECT_MODEL to 'c0c0ac362b03416da06ab3fa36fb58e3' if Clarifai server is down.
    input,
    // Sample images:
    // https://samples.clarifai.com/face-det.jpg
    // https://cdn.pixabay.com/photo/2016/05/23/23/32/human-1411499_960_720.jpg
    // https://post.healthline.com/wp-content/uploads/2019/12/woman_running-at_night-732x549-thumbnail.jpg
    // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStxfDGdlpQGgMkfDCodBJig1PwfZzXNfJTmA&usqp=CAU
  )
  // Return whatever Clarifai gives us back
  .then(data => res.json(data))
  .catch(err => res.status(400).json('unable to work with api'));
}

const handleImage = (req, res, db) => {
  // We receive the user id from the body
  const { id } = req.body;
  db('users')
    .returning('entries')
    .where('id','=', id)
    .increment('entries', 1)
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
  handleApiCall,
  handleImage
};