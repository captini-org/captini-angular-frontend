import {Deserializable} from './deserializable.model';

export class ITask implements Deserializable {
    public id:number | undefined;
    public prompt!: number;
    public task_text!:string;
    audio_url!:string;
    public number!:number ;
    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}