import {Deserializable} from './deserializable.model';
import { IAudio } from './IAudio';


export class ITask implements Deserializable {
    public id:number | undefined;
    public prompt!: number;
    public task_text!:string;
    public examples!:IAudio[];
    public number!:number ;
    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}