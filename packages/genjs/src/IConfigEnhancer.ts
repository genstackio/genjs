export interface IConfigEnhancer {
    enrich(v: any): any;
    enhance(c: any, type: string): any;
}

export default IConfigEnhancer