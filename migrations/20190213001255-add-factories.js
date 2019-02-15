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
  return db.createTable('factories', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    name: 'string',
    max: 'int',
    min: 'int',
    archived: 'boolean',
    created_at: 'datetime',
    updated_at: 'datetime'
  })
};

exports.down = function(db) {
  return db.dropTable('factories')
};

exports._meta = {
  "version": 1
};
