export interface IFinisher {
    execute(dir: string, vars: any): Promise<void>
}

export default IFinisher
