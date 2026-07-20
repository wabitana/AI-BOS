import { Entity, UniqueEntityID } from '@ai-bos/core';
import { ToolCategory } from './Category';

interface ToolProps {
  name: string;
  description: string;
  category: ToolCategory;
  schema: Record<string, any>;
  execute: (args: any) => Promise<any>;
}

export class Tool extends Entity<ToolProps> {
  private constructor(props: ToolProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get category(): ToolCategory {
    return this.props.category;
  }

  get schema(): Record<string, any> {
    return this.props.schema;
  }

  public async execute(args: any): Promise<any> {
    return this.props.execute(args);
  }

  public static create(props: ToolProps, id?: UniqueEntityID): Tool {
    return new Tool(props, id);
  }
}
