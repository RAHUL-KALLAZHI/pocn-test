import { Injectable } from '@angular/core';
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import opentelemetry from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { environment } from 'src/environments/environment';
import { LocalStorageManager } from "./local-storage-manager";
@Injectable({
    providedIn: 'root'
})
    
export class TelemetryService {
    telemetryProvider: any;
    parentTrace: String = '';
    constructor(private _pocnLocalStorageManager: LocalStorageManager) {
        this.telemetryProvider = this.getProvider();
        this.setLogInTrace(this.telemetryProvider);
     }
    getProvider() {       
        const resources = new Resource({
        'service.name': environment.serviceName,
        'application': 'POCN',
    });
        const exporterOptions = {
            url: environment.telemetryUrl
    };
    const exporter = new OTLPTraceExporter(exporterOptions);
    const provider = new WebTracerProvider({ resource: resources });
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register()
    return provider;
    }
    setLogInTrace(telemetryProvider) {
        if (this._pocnLocalStorageManager.getData("userId") && !this._pocnLocalStorageManager.getData("otContext")) {
            if (!this._pocnLocalStorageManager.getData("otContext")) {
                        const spanName = "login-submit-btn";
                        let attributes = {
                            userId: this._pocnLocalStorageManager.getData("userId"),
                            firstName: this._pocnLocalStorageManager.getData("firstName"),
                            lastName: this._pocnLocalStorageManager.getData("lastName"),
                            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                            status:'Success'
                        }
                        const tracer = telemetryProvider.getTracer("User Analytics");
                        const span = tracer.startSpan(spanName);
                        span.setAttributes(attributes);
                        // const pctx = span.spanContext();
                        const eventName = 'user login';
                        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully logged in' }
                        this.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                            this.parentTrace = result;
                        })
                        
                    }
        } else {
            this.parentTrace = this._pocnLocalStorageManager.getData("otContext")
        }        
    }

    async sendTrace(spanName: any, attributes: any,eventName:any,event:any) {
        const tracer = opentelemetry.trace.getTracer("User Analytics");
        let span = tracer.startSpan(spanName);
        if (this._pocnLocalStorageManager.getData("otContext")) {
            let parent = opentelemetry.trace.wrapSpanContext(JSON.parse(this._pocnLocalStorageManager.getData("otContext")));
             const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(),parent);
             span = tracer.startSpan(spanName, undefined, ctx);
        }             
        span.setAttributes(attributes);
        const pctx = span.spanContext();
        if (!this._pocnLocalStorageManager.getData("otContext")) {
            this._pocnLocalStorageManager.saveData("otContext", JSON.stringify(pctx));
        }
        span.addEvent(eventName, event);
        span.end();
        return JSON.stringify(pctx);
        
    }

   


}