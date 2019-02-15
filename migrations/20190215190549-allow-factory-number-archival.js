'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn('factory_numbers', 'archived_at', {
    type: 'datetime'
  }).then(() => {
    db.removeColumn('factory_numbers', 'updated_at')
  });
};

exports.down = function(db) {
  return db.removeColumn('factory_numbers', 'archived_at')
    .then(() => {
      db.addColumn('factory_numbers', 'updated_at', {
        type: 'datetime'
      })
    })
};

exports._meta = {
  "version": 1
};
