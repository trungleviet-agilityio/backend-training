/*
Blogs interface is used to define the interface for the blogs.
*/

/*
IBlogs is the interface for the blogs.
*/
export interface IBlogs {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

/*
IBlogsRequest is the interface for the blogs request.
*/
export interface IBlogsRequest {
    title: string;
    content: string;
}

/*
IBlogsResponse is the interface for the blogs response.
*/
export interface IBlogsResponse {
    blogs: IBlogs[];
}
