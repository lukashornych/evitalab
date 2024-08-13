export class ApiReadiness {
    status: string;
    apis: {
        rest: string;
        system: string;
        lab: string;
        graphQL: string;
        observability: string;
        gRPC: string;
    };

    constructor(status: string, apis: { rest: string; system: string; lab: string; graphQL: string; observability: string; gRPC: string }) {
        this.status = status;
        this.apis = apis;
    }
}