import { Component, OnInit, Input } from '@angular/core';
import { Project, ProjectFileType } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';

declare var $: any;

enum SimulationOptionType {
    FLOAT, BOOLEAN, INTEGER, STRING, CHOICE
}

class SimulationOption {
    propertyName: string;
    displayText: string;
    optionType: SimulationOptionType;
    choices?: string[][];
    value: any;
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
            this.value = choices[0];
        }

        if (!value && optionType === SimulationOptionType.BOOLEAN) {
            this.value = false;
        }
    }

    choose(index: number) {
        if (this.optionType !== SimulationOptionType.CHOICE) {
            return;
        }

        this.value = this.choices[index];
    }
}

@Component({
    selector: 'project-config',
    templateUrl: './project-config.component.html'
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

    private sequenceFile: File;

    private get boxSize() {
        if (this.result && this.result['box_size'] !== undefined) {
            return this.result['box_size'];
        } else {
            this.result['box_size'] = 20;
            return 20;
        }
    }
    private set boxSize(size) {
        this.result['box_size'] = size;
    }

    private shouldRegenerate: boolean;

    private initializing = true;

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
                if (options['backend_precision'].value[0] === 'mixed') {
                    options['backend'].choose(2);
                    options['backend'].validate(options);
                }
            }),
        new SimulationOption('backend', 'Backend Type', SimulationOptionType.CHOICE,
            [['CPU', 'CPU'], ['CUDA', 'CUDA (MD only)']], null, (options) => {
                if (options['backend'].value[0] === 'CUDA') {
                    options['sim_type'].choose(0);
                    options['sim_type'].validate(options);
                }
            }),
        new SimulationOption('debug', 'Debug', SimulationOptionType.BOOLEAN),
    ]

    private simulationOptions = [
        new SimulationOption('steps', 'Simulation Steps', SimulationOptionType.INTEGER, null, 1e6),
        new SimulationOption('seed', 'Simulation Seed', SimulationOptionType.INTEGER, null, 42),
        new SimulationOption('T', 'Temperature (K)', SimulationOptionType.FLOAT, null, 243),
        new SimulationOption('verlet_skin', 'Verlet Skin', SimulationOptionType.FLOAT, null, 0.05),
        new SimulationOption('external_forces', 'Use External Forces', SimulationOptionType.BOOLEAN),
        new SimulationOption('external_forces_file', 'External Forces File Name', SimulationOptionType.STRING),
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

    private result = {};

    constructor(private projectService: ProjectService) {
    }

    ngOnInit() {
        $('[data-toggle="collapse-hover"]').each(function () {
            const thisdiv = $(this).attr('data-target');
            $(thisdiv).addClass('collapse-hover');
        });

        $('[data-toggle="collapse-hover"]').hover(function () {
            const thisdiv = $(this).attr('data-target');
            if (!$(this).hasClass('state-open')) {
                $(this).addClass('state-hover');
                $(thisdiv).css({
                    'height': '30px'
                });
            }

        },
            function () {
                const thisdiv = $(this).attr('data-target');
                $(this).removeClass('state-hover');

                if (!$(this).hasClass('state-open')) {
                    $(thisdiv).css({
                        'height': '0px'
                    });
                }
            }).click(function (event) {
                event.preventDefault();

                const thisdiv = $(this).attr('data-target');
                const height = $(thisdiv).children('.panel-body').height();

                if ($(this).hasClass('state-open')) {
                    $(thisdiv).css({
                        'height': '0px',
                    });
                    $(this).removeClass('state-open');
                } else {
                    $(thisdiv).css({
                        'height': height + 30,
                    });
                    $(this).addClass('state-open');
                }
            });

        if ($('.dropdown').hasClass('show-dropdown')) {
            $('.dropdown').addClass('open');
        }

        this.buildOptionsMap();
        this.projectService.getSettings(this.project.id).then(response => {
            if (typeof response === 'string') {
            } else {
                this.initializeOptions(response);

                this.initializing = false
            }
        }, error => {
        });
    }

    buildOptionsMap() {
        for (const option of this.genericOptions) {
            this.optionsMap[option.propertyName] = option;
        }

        for (const option of this.simulationOptions) {
            this.optionsMap[option.propertyName] = option;
        }

        for (const option of this.mdSimulationOptions) {
            this.optionsMap[option.propertyName] = option;
        }
    }

    initializeOptions(response) {
        console.log(response);

        Object.keys(response).forEach(key => {
            if (key === 'box_size') {
                this.boxSize = response[key];
            }

            if (this.optionsMap[key]) {
                const responseValue = response[key];
                const option: SimulationOption = this.optionsMap[key];

                if (option.optionType === SimulationOptionType.CHOICE) {
                    for (const choice of option.choices) {
                        if (choice[0] === response[key]) {
                            option.value = choice;
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
        this.result['refresh_vel'] = 1;
        this.result['box_size'] = this.boxSize;
        this.result['generation_method'] = 'generate-sa';
        for (const option of this.genericOptions) {
            if (option.optionType === SimulationOptionType.CHOICE) {
                this.result[option.propertyName] = option.value[0];
            } else if (option.optionType === SimulationOptionType.BOOLEAN) {
                this.result[option.propertyName] = option.value ? 1 : 0;
            } else {
                this.result[option.propertyName] = option.value;
            }
        }

        for (const option of this.simulationOptions) {
            if (option.optionType === SimulationOptionType.CHOICE) {
                this.result[option.propertyName] = option.value[0];
            } else if (option.optionType === SimulationOptionType.BOOLEAN) {
                this.result[option.propertyName] = option.value ? 1 : 0;
            } else {
                this.result[option.propertyName] = option.value;
            }
        }

        for (const option of this.mdSimulationOptions) {
            if (option.optionType === SimulationOptionType.CHOICE) {
                this.result[option.propertyName] = option.value[0];
            } else if (option.optionType === SimulationOptionType.BOOLEAN) {
                this.result[option.propertyName] = option.value ? 1 : 0;
            } else {
                this.result[option.propertyName] = option.value;
            }
        }
    }

    backClicked() {
        if (this.loading) {
            return;
        }
        this.didClickBack();
    }

    check() {
        this.buildResults();

        console.log(this.result);
        console.log(this.sequenceFile);
    }

    choose(option: SimulationOption, choice) {
        option.value = choice;
        option.validate(this.optionsMap);
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.sequenceFile = fileList[0];
        }
        this.shouldRegenerate = true;
    }

    runSimulation() {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.buildResults();

        if (this.sequenceFile) {
            this.projectService.uploadFile(this.project.id, this.sequenceFile, ProjectFileType.SEQUENCE).then(_ => {
                this.applySettings();
            }, _ => {
                this.loading = false;
                console.log('Couldn\'t upload file');
            });
        } else {
            this.applySettings();
        }
    }

    applySettings() {
        this.projectService.putSettings(this.project.id, this.result).then(response => {
            this.loading = false;
            if (response === 'success') {
                this.execute();
                console.log('settings added');
            } else {
                console.log('error');
            }
        }, _ => { /* error */
            this.loading = false;
        });
    }

    execute() {
        this.projectService.execute(this.project.id, this.shouldRegenerate).then(response => {
            console.log(response);
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
