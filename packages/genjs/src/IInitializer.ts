export interface IInitializer {
    execute(dir: string, vars: any): Promise<void>
}

export default IInitializer
