#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();

const templatesAndTargets = [
    {
        template: '../src/environments/environment.ts.template',
        target: '../src/environments/environment.ts'
    },
    {
        template: '../src/environments/environment.prod.ts.template',
        target: '../src/environments/environment.prod.ts'
    },
    {
        template: '../htmol/local/config.js.template',
        target: '../htmol/local/config.js'
    },
	
	//additions for the analysis scripts, need WAN_IP to be interpolated
	{
		template: '../analysis/visualizer/HTMoL.html.template',
        target: '../analysis/visualizer/HTMoL.html'
	},
	{
		template: '../analysis/visualizer/local/config.js.template',
        target: '../analysis/visualizer/local/config.js'
	}
];

// Define default values in case there are no defined ones,
// but you should define only non-crucial values here,
// because build should fail if you don't provide the correct values
// for your production environment

const processVar = Object.assign({}, process.env);

// Load template file
for (let templateAndTarget of templatesAndTargets) {
    templateFilePath = path.join(__dirname, templateAndTarget.template);
    targetFilePath = path.join(__dirname, templateAndTarget.target);

    // Read template file
    const environmentTemplate = fs.readFileSync(templateFilePath, { encoding: 'utf-8' });

    // Generate output data
    const output = ejs.render(environmentTemplate, processVar);

    // Write environment file
    fs.writeFileSync(targetFilePath, output);
}

process.exit(0);