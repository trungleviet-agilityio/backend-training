/*
Create blog DTO is used to define the DTO for creating blogs.
*/

import { IsNotEmpty, IsString, MaxLength } from "class-validator";

/*
CreateBlogDto is a DTO that defines the structure of the blog data.
*/
export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  readonly content: string;
}
