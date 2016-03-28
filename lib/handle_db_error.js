'use strict';

module.exports = exports = (err, res) => {
  if (err) return res.json(err);
  res.status(500).json({msg: 'Database error'});
};
