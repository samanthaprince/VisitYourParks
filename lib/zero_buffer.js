'use strict';

module.exports = exports = (buff) => {
  for (let i = 0; i < buff.length; i++) {
    buff.writeUInt8(0, i);
  }
};
