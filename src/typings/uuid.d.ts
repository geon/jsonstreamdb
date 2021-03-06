declare module "uuid" {

    export interface V1Options {
        node?: number[], // 6 bytes
        clockseq?: number,
        msecs?: number | Date,
        nsecs?: number
    }

    export function v1():string;
    export function v1(opts:V1Options):string;
    export function v1(opts:V1Options, buf:Uint8Array, offset?:number):Uint8Array;
    export function v1(opts:V1Options, buf:number[], offset?:number):number[];

    export interface V4Options {
        random?: number[], // 16 bytes
        rng?: () => number[] // 16 bytes
    }

    export function v4():string;
    export function v4(opts:V4Options):string;
    export function v4(opts:V4Options, buf:Uint8Array, offset?:number):Uint8Array;
    export function v4(opts:V4Options, buf:number[], offset?:number):number[];

    export function parse(uuid:string):number[];
    export function parse(uuid:string, buf:Uint8Array, offset?:number):Uint8Array;
    export function parse(uuid:string, buf:number[], offset?:number):number[];

    export function unparse(buf:Uint8Array | number[], offset?: number):string;
}
