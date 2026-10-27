import * as migration_20261027_023644 from './20261027_023644'
import * as migration_20261027_024918 from './20261027_024918'
import * as migration_20261027_072333_phase1_release1 from './20261027_072333_phase1_release1'

export const migrations = [
  {
    up: migration_20261027_023644.up,
    down: migration_20261027_023644.down,
    name: '20261027_023644',
  },
  {
    up: migration_20261027_024918.up,
    down: migration_20261027_024918.down,
    name: '20261027_024918',
  },
  {
    up: migration_20261027_072333_phase1_release1.up,
    down: migration_20261027_072333_phase1_release1.down,
    name: '20261027_072333_phase1_release1',
  },
]
