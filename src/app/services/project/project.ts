export class Project {
    id?: string;
    user: string;
    name: string;
    data_file: string;
    created_on: Date;

    constructor() { }
}

export enum ProjectFileType {
    SEQUENCE = 'SEQUENCE', TRAJECTORY_DAT = 'TRAJECTORY_DAT'
}

export class LogResponse {
    running: boolean;
    log: string;
    stdout: string;
}
