module.exports = (req, res) => {
  return res.status(200).send({ message: req.body.message });
}