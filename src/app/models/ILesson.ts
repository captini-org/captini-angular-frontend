
import {Deserializable} from './deserializable.model';
import {IPrompts} from './IPrompts'
export class ILesson implements Deserializable {
    public id:number | undefined;
    public description!: string;
    public subject!:string;
    public Prompts!:IPrompts[];
    deserialize(input: any): this {
        // Assign input to our object BEFORE deserialize our prompts to prevent already deserialized prompts from being overwritten.
        Object.assign(this, input);
        // Iterate over all prompts for our lesson and map them to a proper `prompet` model
        //this.Prompts = input.Prompts.map((promp: any) => new IPrompts().deserialize(promp));
        return this;
      }
}