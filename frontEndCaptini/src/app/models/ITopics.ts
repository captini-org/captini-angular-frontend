import {Deserializable} from './deserializable.model';
import {ILesson} from './ILesson'
export class ITopics implements Deserializable {
    public id!:number;
    public level!:number;
    public topic_name!:string;
    public lessons !: ILesson[];
    deserialize(input: any): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
    
        // Iterate over all cars for our user and map them to a proper `Car` model
        //this.lessons = input.lessons.map((less:any) => new ILesson().deserialize(less));
        return this;
      }
}
