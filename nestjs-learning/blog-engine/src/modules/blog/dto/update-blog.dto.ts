/*
Update blog DTO is used to define the DTO for updating blogs.
*/

import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
