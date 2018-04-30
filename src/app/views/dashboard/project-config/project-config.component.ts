import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../services/user/user';
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { AuthenticationService } from '../../../services/auth-guard/auth.service';
import { ApiService } from '../../../services/api-service/api.service';

declare var $: any;

enum SimulationOptionType {
    FLOAT, BOOLEAN, INTEGER, STRING, CHOICE
}

class SimulationOptionChoice {
    propertyValue: string;
    displayText: string;
}

class SimulationOption {
    propertyName: string;
    displayText: string;
    optionType: SimulationOptionType;
    choices?: string[][];
    value: any;
    validate = (options) => { };

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

    private loading = false;

    private sequenceFile: File;
    private boxSize = 20;

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

    private result = {
    };

    constructor(
        private projectService: ProjectService,
        private apiService: ApiService) {
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
        this.apiService.getProjectSettings(this.project.id).then(response => {
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
        console.log(this.optionsMap);
        Object.keys(response).forEach(key => {
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
                } else {
                    option.value = response[key];
                }
            }
        });
    }

    buildResults() {
        this.result['refresh_vel'] = 1;
        this.result['box_size'] = this.boxSize;
        for (const option of this.genericOptions) {
            if (option.optionType === SimulationOptionType.CHOICE) {
                this.result[option.propertyName] = option.value[0];
            } else {
                this.result[option.propertyName] = option.value;
            }
        }

        for (const option of this.simulationOptions) {
            if (option.optionType === SimulationOptionType.CHOICE) {
                this.result[option.propertyName] = option.value[0];
            } else {
                this.result[option.propertyName] = option.value;
            }
        }

        for (const option of this.mdSimulationOptions) {
            if (option.optionType === SimulationOptionType.CHOICE) {
                this.result[option.propertyName] = option.value[0];
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
        // do something
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.sequenceFile = fileList[0];
        }
    }

    runSimulation() {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.buildResults();

        if (this.sequenceFile) {
            this.apiService.uploadFile(this.project.id, this.sequenceFile, 'sequence.txt').then(response => {
                this.applySettings();
            }, error => {
                this.loading = false;
                console.log('couldnt uplaod file');
            });
        } else {
            this.applySettings();
        }
    }

    applySettings() {
        this.apiService.setProjectSettings(this.project.id, this.result).then(response2 => {
            this.loading = false;
            if (response2 === 'success') {
                this.execute();
                console.log('settings added');
            } else {
                console.log('error');
            }
        }, error => {
            this.loading = false;
        });
    }

    execute() {
        this.apiService.runSimulation(this.project.id).then(response => {
            console.log(response);
            this.backClicked();
        });
    }
}
