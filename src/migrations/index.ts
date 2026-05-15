import * as migration_20260515_105450_add_festival_active_field from './20260515_105450_add_festival_active_field';

export const migrations = [
  {
    up: migration_20260515_105450_add_festival_active_field.up,
    down: migration_20260515_105450_add_festival_active_field.down,
    name: '20260515_105450_add_festival_active_field'
  },
];
