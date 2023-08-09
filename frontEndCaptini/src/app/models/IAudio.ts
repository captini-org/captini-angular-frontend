import {Deserializable} from './deserializable.model';

export class IAudio implements Deserializable {
    public id:number | undefined;
    public gender!: string;
    public recording!:string;
    public task_id!:number ;
    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}