import { Log } from "../util";
import { Worker } from "worker_threads";
import path from "path";

export type Service = "update-mapper-leaderboard" | "update-zones" | "update-competitions" | "update-maps" | "update-challenges" | "periodical-update" | "initialize";

const IS_RUNNING = 1;
const IS_PAUSED = 0;

type ServiceError = {
    service: Service;
    message: string;
    timestamp: number;
}

const run = (service: string, config: unknown): Promise<void> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, `./workers/${service}.js`));

        worker.postMessage(config ?? {});

        worker.on("message", (message: string) => {
            worker.terminate();
            resolve();
        });

        worker.on("error", error => {
            worker.terminate();
            reject(error);

        })

        worker.on('exit', (code) => {
            worker.terminate();
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }

        });
    })
}

class ServiceManager {

    private readonly status: Record<Service, number>;
    private readonly serviceErrors: ServiceError[];

    constructor() {
        this.serviceErrors = [];
        this.status = {
            "initialize": IS_PAUSED,
            "periodical-update": IS_PAUSED,
            "update-challenges": IS_PAUSED,
            "update-competitions": IS_PAUSED,
            "update-maps": IS_PAUSED,
            "update-zones": IS_PAUSED,
            "update-mapper-leaderboard": IS_PAUSED
        }
    }

    public start(service: Service, config?: unknown) {
        if (this.status[service] === IS_RUNNING) {
            Log.error(`${service} is already running.`);
            return false;
        }

        Log.info("Started.", service);
        this.status[service] = IS_RUNNING;
        run(service, config)
            .then(_ => {
                this.status[service] = IS_PAUSED;
                Log.complete("Succesfully finished.", service);
            })
            .catch(error => {
                const message = error.message ?? "Unknown error.";
                console.error(error);
                Log.error(message, service);
                this.status[service] = IS_PAUSED;

                this.serviceErrors.push({
                    service,
                    message,
                    timestamp: Date.now()
                });
            });
        return true;
    }

    public getStatus() {
        return this.status;
    }

    public getErrors() {
        return this.serviceErrors;
    }

    public clearErrors() {
        this.serviceErrors.length = 0;
    }

}



export const serviceManager = new ServiceManager();