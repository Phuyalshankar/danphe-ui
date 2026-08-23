'use strict';

const path = require('path');
const FullSystemComparator = require('./FullSystemComparator');

const targetArg = process.argv[2] || 'd:/dolphin-pbx/app/components/AppBar.jsx';
const comparator = new FullSystemComparator();

try {
    comparator.auditFile(targetArg);
} catch (e) {
    console.error(`❌ Audit failed:`, e.message);
    process.exit(1);
}
