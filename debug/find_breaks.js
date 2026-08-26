'use strict';

const PipelineBreakInspector = require('./PipelineBreakInspector');

const inspector = new PipelineBreakInspector();
const targetFile = process.argv[2] || 'd:/dolphin-pbx/app/components/AppBar.jsx';

inspector.inspectFile(targetFile);
