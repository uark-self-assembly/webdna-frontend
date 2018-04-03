import { Component, OnInit, Input } from '@angular/core';
import { User } from "../../../services/user/user";
import { Project } from '../../../services/project/project';
import { ProjectService } from '../../../services/project/project.service';
import { AuthenticationService } from '../../../services/auth-guard/auth.service';

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

    constructor(propertyName: string, displayText: string, optionType: SimulationOptionType, choices?: string[][], value?: any, validate?: (options) => void) {
        this.propertyName = propertyName;
        this.displayText = displayText;
        this.optionType = optionType;
        this.choices = choices;
        this.value = value;

        if (validate) {
            this.validate = validate;
        }

        if (optionType == SimulationOptionType.CHOICE) {
            this.value = choices[0];
        }

        if (!value && optionType == SimulationOptionType.BOOLEAN) {
            this.value = false;
        }
    }

    choose(index: number) {
        if (this.optionType != SimulationOptionType.CHOICE) {
            return;
        }

        this.value = this.choices[index];
    }
}

@Component({
    selector: 'project-config',
    templateUrl: './project-config.component.html'
})

export class ProjectConfigComponent {
    SimulationOptionType = SimulationOptionType

    @Input()
    project: Project;

    @Input()
    public didClickBack: () => void;

    private genericOptions = [
        new SimulationOption('interaction_type', 'Interaction Type', SimulationOptionType.CHOICE, [['DNA', 'DNA (oxDNA Model)'], ['DNA2', 'DNA2 (oxDNA2 Model)'], ['RNA', 'RNA (oxRNA Model)'], ['LJ', 'LJ (Lennar-Jones)'], ['patchy', 'patchy']]),
        new SimulationOption('sim_type', 'Simulation Type', SimulationOptionType.CHOICE, [['MD', 'MD (Molecular Dynamics)'], ['MC', 'MC (Monte Carlo)'], ['VMMC', 'VMMC (Virtual Move Monte Carlo)']]),
        new SimulationOption('backend', 'Backend Type', SimulationOptionType.CHOICE, [['',' '], ['CPU', 'CPU'], ['CUDA', 'CUDA (MD only)']], null, (options) => {
            if (options['backend'].value[0] == 'CUDA') {
                options['sim_type'].choose(0);
                options['sim_type'].validate(options);
            }
        }),
        new SimulationOption('backend_precision', 'Floating Point Precision', SimulationOptionType.CHOICE, [['',' '], ['float', 'float (low)'], ['double', 'double (high)'], ['mixed', 'mixed (CUDA only)']], null, (options) => { 
            if (options['backend_precision'].value[0] == 'mixed') {
                options['backend'].choose(2);
                options['backend'].validate(options);
            } 
        }),
        new SimulationOption('debug', 'Debug', SimulationOptionType.BOOLEAN),
    ]

    private simulationOptions = [
        
    ]

    private optionsMap = {};

    private result = {
    };

    constructor(private projectService: ProjectService) {
        this.buildOptionsMap();
    }

    ngOnInit() {
        $('[data-toggle="collapse-hover"]').each(function () {
            var thisdiv = $(this).attr("data-target");
            $(thisdiv).addClass("collapse-hover");
        });

        $('[data-toggle="collapse-hover"]').hover(function () {
            var thisdiv = $(this).attr("data-target");
            if (!$(this).hasClass('state-open')) {
                $(this).addClass('state-hover');
                $(thisdiv).css({
                    'height': '30px'
                });
            }

        },
            function () {
                var thisdiv = $(this).attr("data-target");
                $(this).removeClass('state-hover');

                if (!$(this).hasClass('state-open')) {
                    $(thisdiv).css({
                        'height': '0px'
                    });
                }
            }).click(function (event) {
                event.preventDefault();

                var thisdiv = $(this).attr("data-target");
                var height = $(thisdiv).children('.panel-body').height();

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
    }

    buildOptionsMap() {
        for (let option of this.genericOptions) {
            this.optionsMap[option.propertyName] = option;
        }
    }

    backClicked() {
        this.didClickBack();
    }

    check() {
        for (let option of this.genericOptions) {
            if (option.optionType == SimulationOptionType.CHOICE) {
                this.result[option.propertyName] = option.value[0];
            } else {
                this.result[option.propertyName] = option.value;
            }
        }

        console.log(this.result);
    }

    choose(option: SimulationOption, choice) {
        option.value = choice;
        option.validate(this.optionsMap);
    }
}
