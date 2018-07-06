export class Job {
    id?: string;
    project: string;
    start_time: Date;
    finish_time: Date;
    process_name: string;
    terminated: boolean;
}

export class Project {
    id?: string;
    user: string;
    name: string;
    data_file: string;
    created_on: Date;
    job: Job;

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
