import { Deserializable } from "./deserializable.model";

export class PhoneFeedback implements Deserializable {
    public phone!: string;
    public phone_score!: number;
    deserialize(input: any): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
    
        // Iterate over all cars for our user and map them to a proper `Car` model
        //this.lessons = input.lessons.map((less:any) => new ILesson().deserialize(less));
        return this;
      }
};
export class WordFeedback implements Deserializable  {
    public word!: string;
    public word_score!: number;
    public phone_feedback!:PhoneFeedback[]
    deserialize(input: any): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
    
        // Iterate over all cars for our user and map them to a proper `Car` model
        //this.lessons = input.lessons.map((less:any) => new ILesson().deserialize(less));
        return this;
      }
};

export class Feedback implements Deserializable {
    public task_feedback!: number;
    public word_feedback!: WordFeedback[]
    deserialize(input: any): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
    
        // Iterate over all cars for our user and map them to a proper `Car` model
        //this.lessons = input.lessons.map((less:any) => new ILesson().deserialize(less));
        return this;
      }
};

export class IScore  implements Deserializable{
    public user_id!: number;
    public task_id!: number;
    public recording_id!: number;
    public feedback!: Feedback;
    deserialize(input: any): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
    
        // Iterate over all cars for our user and map them to a proper `Car` model
        //this.lessons = input.lessons.map((less:any) => new ILesson().deserialize(less));
        return this;
      }

};