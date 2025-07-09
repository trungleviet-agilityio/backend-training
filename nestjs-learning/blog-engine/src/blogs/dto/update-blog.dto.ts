/*
Update blog DTO is used to define the DTO for updating blogs.
*/

import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

/*
UpdateBlogDto is a DTO that defines the structure of the blog data.
*/
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
