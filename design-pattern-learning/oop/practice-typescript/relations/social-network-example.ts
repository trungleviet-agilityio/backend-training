// Relations Example: Social Network Domain
// Demonstrates association, dependency, composition, aggregation

// Association: SocialNetworkUser has SocialNetworkPosts
class SocialNetworkUser {
  constructor(public name: string, public posts: SocialNetworkPost[] = []) {}
}

// SocialNetworkPost: Each post has comments and an author
class SocialNetworkPost {
  comments: SocialNetworkComment[] = [];
  constructor(public content: string, public author: SocialNetworkUser) {}
}

// Dependency: SocialNetworkUser likes a SocialNetworkPost (temporary interaction)
function likeSocialNetworkPost(user: SocialNetworkUser, post: SocialNetworkPost) {
  console.log(`${user.name} likes post: ${post.content}`);
}

// Composition: SocialNetworkPost owns SocialNetworkComments (lifecycle bound)
class SocialNetworkComment {
  constructor(public text: string, public author: SocialNetworkUser) {}
}

// Aggregation: SocialNetworkUser can comment on many posts
const socialAlice = new SocialNetworkUser('Alice');
const socialBob = new SocialNetworkUser('Bob');
const socialPost1 = new SocialNetworkPost('Hello world!', socialAlice);
const socialPost2 = new SocialNetworkPost('TypeScript is awesome!', socialBob);

const socialComment1 = new SocialNetworkComment('Nice post!', socialBob);
const socialComment2 = new SocialNetworkComment('Thank you!', socialAlice);

socialPost1.comments.push(socialComment1);
socialPost2.comments.push(socialComment2);

socialAlice.posts.push(socialPost1);
socialBob.posts.push(socialPost2);

likeSocialNetworkPost(socialBob, socialPost1);
console.log(socialPost1.comments);
console.log(socialPost2.comments);
