import { ITask } from './ITask';
import {Deserializable} from './deserializable.model';

export class IPrompts implements Deserializable {
    public id:number | undefined;
    public prompt_number!: number;
    public flashcard_text!:string;
    audio_url!:string;
    public tasks?: ITask[]
    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
