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
    created_on: Date;
    job: Job;

    get running() {
        return this.job && !this.job.finish_time;
    }

    get hasOutput() {
        return this.job;
    }

    get executionTime() {
        if (this.hasOutput) {
            if (!this.running) {
                const finishTime = new Date(this.job.finish_time).getTime();
                const startTime = new Date(this.job.start_time).getTime();
                const minutes = Math.floor((finishTime - startTime) / 60000);

                if (this.job.terminated) {
                    return 'Terminated: ' + minutes + ' min';
                } else {
                    return 'Finished: ' + minutes + ' min';
                }
            }

            const currentTime = new Date().getTime();
            const startTime = new Date(this.job.start_time).getTime();

            return 'Running: ' + Math.floor((currentTime - startTime) / 60000) + ' min'
        } else {
            return 'Never run.';
        }
    }

    constructor(other?: Project) {
        if (other) {
            this.id = other.id;
            this.user = other.user;
            this.name = other.name;
            this.created_on = other.created_on;
            this.job = other.job;
        }
    }
}

export enum ProjectFileType {
    SEQUENCE = 'SEQUENCE', TRAJECTORY_DAT = 'TRAJECTORY_DAT'
}

export class LogResponse {
    running: boolean;
    log: string;
    stdout: string;
}
