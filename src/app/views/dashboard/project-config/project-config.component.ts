import { Component, OnInit, Input, Inject } from '@angular/core';
import { Project, ProjectFileType } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DOCUMENT } from '@angular/platform-browser';

class OptionCollection {
    name: string;
    options: SimulationOption[];
    something: MatSlideToggle

    constructor(name: string, options: SimulationOption[]) {
        this.name = name;
        this.options = options;
    }
}

enum SimulationOptionType {
    BOOLEAN, INTEGER, FLOAT, STRING, CHOICE, FILE
}

class SimulationOption {
    propertyName: string;
    displayText: string;
    optionType: SimulationOptionType;
    choices?: string[][];
    private _value: any;
    get value() {
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
        if (this.validate && this.optionsMap) {
            this.validate(this.optionsMap);
        }
    }

    optionsMap: Map<String, SimulationOption>;
    validate = (_) => { };

    constructor(
        propertyName: string,
        displayText: string,
        optionType: SimulationOptionType,
        choices?: string[][],
        value?: any,
        validate?: (options) => void) {
        this.propertyName = propertyName;
        this.displayText = displayText;
        this.optionType = optionType;
        this.choices = choices;
        this.value = value;

        if (validate) {
            this.validate = validate;
        }

        if (optionType === SimulationOptionType.CHOICE) {
            this.value = choices[0][0];
        }

        if (!value && optionType === SimulationOptionType.BOOLEAN) {
            this.value = false;
        }
    }

    choose(index: number) {
        if (this.optionType !== SimulationOptionType.CHOICE) {
            return;
        }

        this.value = this.choices[index][0];
    }
}

@Component({
    selector: 'project-config',
    templateUrl: './project-config.component.html',
    styleUrls: ['./project-config.component.scss']
})

export class ProjectConfigComponent implements OnInit {
    SimulationOptionType = SimulationOptionType

    @Input()
    project: Project;

    @Input()
    public didClickBack: () => void;

    @Input()
    public didClickAnalysis: () => void;

    private loading = false;

    private generationOptions = [
        new SimulationOption('sequence_file', 'Sequence File', SimulationOptionType.FILE, null, null, (options) => {
            if (options['sequence_file'].value) {
                options['should_regenerate'].value = true;
            }
        }),
        new SimulationOption('box_size', 'Box Size', SimulationOptionType.INTEGER, null, 20),
        new SimulationOption('should_regenerate', 'Regenerate Initial Topology', SimulationOptionType.BOOLEAN),
    ]

    private genericOptions = [
        new SimulationOption(
            'interaction_type', 'Interaction Type', SimulationOptionType.CHOICE,
            [
                ['DNA', 'DNA (oxDNA Model)'],
                ['DNA2', 'DNA2 (oxDNA2 Model)'],
                ['RNA', 'RNA (oxRNA Model)'],
                ['LJ', 'LJ (Lennar-Jones)'],
                ['patchy', 'patchy']
            ]),
        new SimulationOption(
            'sim_type', 'Simulation Type', SimulationOptionType.CHOICE,
            [['MD', 'MD (Molecular Dynamics)'], ['MC', 'MC (Monte Carlo)'], ['VMMC', 'VMMC (Virtual Move Monte Carlo)']]),
        new SimulationOption(
            'backend_precision', 'Floating Point Precision', SimulationOptionType.CHOICE,
            [['float', 'float (low)'], ['double', 'double (high)'], ['mixed', 'mixed (CUDA only)']], 1, (options) => {
                if (options['backend_precision'].value === 'mixed') {
                    options['backend'].choose(2);
                }
            }),
        new SimulationOption('backend', 'Backend Type', SimulationOptionType.CHOICE,
            [['CPU', 'CPU'], ['CUDA', 'CUDA (MD only)']], null, (options) => {
                if (options['backend'].value === 'CUDA') {
                    options['sim_type'].choose(0);
                }
            }),
        new SimulationOption('debug', 'Debug', SimulationOptionType.BOOLEAN),
    ]

    private simulationOptions = [
        new SimulationOption('steps', 'Simulation Steps', SimulationOptionType.INTEGER, null, 1_000_000),
        new SimulationOption('seed', 'Simulation Seed', SimulationOptionType.INTEGER, null, 42),
        new SimulationOption('T', 'Temperature (K)', SimulationOptionType.FLOAT, null, 243),
        new SimulationOption('verlet_skin', 'Verlet Skin', SimulationOptionType.FLOAT, null, 0.05),
        new SimulationOption('external_forces_file', 'External Forces File', SimulationOptionType.FILE, null, null, (options) => {
            if (options['external_forces_file'].value) {
                options['external_forces'].value = true;
            }
        }),
        new SimulationOption('external_forces', 'Use External Forces', SimulationOptionType.BOOLEAN),
    ]

    private mdSimulationOptions = [
        new SimulationOption('thermostat', 'Thermostat', SimulationOptionType.CHOICE,
            [['no', 'None'], ['refresh', 'Refresh'], ['brownian', 'Brownian'], ['john', 'John']]),
        new SimulationOption('dt', 'Integration Time Step', SimulationOptionType.FLOAT, null, 0.005),
        new SimulationOption('newtonian_steps', 'Newtonian Steps', SimulationOptionType.INTEGER, null, 103),
        new SimulationOption('diff_coeff', 'Diff Coeff', SimulationOptionType.INTEGER, null, 2.5),
        new SimulationOption('print_conf_interval', 'Output Configuration every', SimulationOptionType.INTEGER, null, 10000),
    ]

    private optionsMap: Map<string, SimulationOption> = new Map<string, SimulationOption>();

    private optionCollections: OptionCollection[] = [];

    private result = {};

    constructor(@Inject(DOCUMENT) document, private projectService: ProjectService, private snackBar: MatSnackBar) {
        this.optionCollections = [
            new OptionCollection('Generation Options', this.generationOptions),
            new OptionCollection('Generic Options', this.genericOptions),
            new OptionCollection('Simulation Options', this.simulationOptions),
            new OptionCollection('Molecular Dynamics Simulation Options', this.mdSimulationOptions)
        ];

        this.buildOptionsMap();
    }

    ngOnInit() {
        this.loading = true;
        this.projectService.getSettings(this.project.id).then(response => {
            this.initializeOptions(response);
            this.loading = false;
        }, _ => {
            this.loading = false;
        });
    }

    buildOptionsMap() {
        for (const optionCollection of this.optionCollections) {
            optionCollection.options.forEach(option => {
                this.optionsMap[option.propertyName] = option;
                option.optionsMap = this.optionsMap;
            });
        }
    }

    initializeOptions(response) {
        Object.keys(response).forEach(key => {
            if (this.optionsMap[key]) {
                const responseValue = response[key];
                const option: SimulationOption = this.optionsMap[key];

                if (option.optionType === SimulationOptionType.CHOICE) {
                    for (const choice of option.choices) {
                        if (choice[0] === response[key]) {
                            option.value = choice[0];
                        }
                    }
                } else if (option.optionType === SimulationOptionType.FLOAT) {
                    const split = responseValue.split(/\s+/);
                    option.value = Number(split[0]);
                } else if (option.optionType === SimulationOptionType.BOOLEAN) {
                    option.value = response[key] === 1;
                } else {
                    option.value = response[key];
                }
            }
        });
    }

    buildResults() {
        const ignoreKeys = ['sequence_file', 'should_regenerate']

        this.result['refresh_vel'] = 1;
        this.result['generation_method'] = 'generate-sa';

        for (const optionCollection of this.optionCollections) {
            for (const option of optionCollection.options) {
                if (ignoreKeys.indexOf(option.propertyName) > -1) {
                    continue;
                }

                if (option.optionType === SimulationOptionType.BOOLEAN) {
                    this.result[option.propertyName] = option.value ? 1 : 0;
                } else {
                    this.result[option.propertyName] = option.value;
                }
            }
        }
    }

    backClicked() {
        if (!this.loading) {
            this.didClickBack();
        }
    }

    fileChange(event, option: SimulationOption) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            option.value = fileList[0];
        }
    }

    fileButtonClicked(option: SimulationOption) {
        document.getElementById(option.propertyName).click();
    }

    showSnackBar(message: string) {
        this.snackBar.open(message, null, {
            duration: 2000
        });
    }

    save(execute: boolean = false) {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.buildResults();

        const sequenceFile = this.optionsMap['sequence_file'].value;

        if (sequenceFile) {
            this.projectService.uploadFile(this.project.id, sequenceFile, ProjectFileType.SEQUENCE).then(_ => {
                this.applySettings(execute);
            }, _ => {
                this.loading = false;
                console.log('Couldn\'t upload file');
            });
        } else {
            this.applySettings(execute);
        }
    }

    applySettings(execute: boolean = false) {
        this.projectService.putSettings(this.project.id, this.result).then(response => {
            this.loading = false;
            if (execute) {
                this.execute();
            } else {
                this.showSnackBar('Project settings saved successfully');
            }
        }, _ => { /* error */
            this.loading = false;
        });
    }

    execute() {
        const shouldRegenerate = this.optionsMap['should_regenerate'].value;
        this.projectService.execute(this.project.id, shouldRegenerate).then(response => {
            this.backClicked();
        });
    }

    analysisClicked() {
        if (this.loading) {
            return;
        } else {
            this.didClickAnalysis();
        }
    }
}
