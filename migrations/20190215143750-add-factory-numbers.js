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
  return db.createTable('factory_numbers', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    factory_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'factory_numbers_factory_id_fk',
        table: 'factories',
        rules: {
          onDelete: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    value: 'int',
    created_at: 'datetime',
    updated_at: 'datetime'
  })
};

exports.down = function(db) {
  return db.dropTable('factory_numbers');
};

exports._meta = {
  "version": 1.1
};
