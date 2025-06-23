import fetch from 'node-fetch';
//  1: Use this Fake JSON API: https://jsonplaceholder.typicode.com/
const FJUrl = 'https://jsonplaceholder.typicode.com';

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function runExercise() {
    try {
        //  2: Get data from all users
        const users = await fetchData(`${FJUrl}/users`);
        console.log("Users fetched successfully.");

        //  3: Get all posts and comments and map with users
        const posts = await fetchData(`${FJUrl}/posts`);
        const comments = await fetchData(`${FJUrl}/comments`);

        const usersWithPostsAndComments = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            const userComments = comments.filter(comment =>
                userPosts.some(post => post.id === comment.postId)
            );
            return {
                ...user,
                posts: userPosts,
                comments: userComments
            };
        });
        console.log("\nUsers with posts and comments mapped:");
        console.log(JSON.stringify(usersWithPostsAndComments, null, 2));


        //  4: Filter only users with more than 3 comments
        const usersWithMoreThan3Comments = usersWithPostsAndComments.filter(user => user.comments.length > 3);
        console.log("\nUsers with more than 3 comments:");
        console.log(JSON.stringify(usersWithMoreThan3Comments.map(user => ({ id: user.id, name: user.name, commentsCount: user.comments.length })), null, 2));


        //  5: Reformat the data with the count of comments and posts
        const usersWithCounts = usersWithPostsAndComments.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            commentsCount: user.comments.length,
            postsCount: user.posts.length
        }));
        console.log("\nUsers with commentsCount and postsCount:");
        console.log(JSON.stringify(usersWithCounts, null, 2));


        //  6: Who is the user with the most comments/posts?
        const userWithMostComments = usersWithCounts.reduce((prev, current) =>
            (prev.commentsCount > current.commentsCount) ? prev : current
        );
        const userWithMostPosts = usersWithCounts.reduce((prev, current) =>
            (prev.postsCount > current.postsCount) ? prev : current
        );
        console.log("\nUser with the most comments:", userWithMostComments.name);
        console.log("User with the most posts:", userWithMostPosts.name);


        //  7: Sort the list of users by the postsCount value descending
        const sortedUsersByPostsCount = [...usersWithCounts].sort((a, b) => b.postsCount - a.postsCount);
        console.log("\nUsers sorted by postsCount descending:");
        console.log(JSON.stringify(sortedUsersByPostsCount, null, 2));


        //  8: Get post with ID 1 and its comments, then merge
        const [post1, commentsForPost1] = await Promise.all([
            fetchData(`${FJUrl}/posts/1`),
            fetchData(`${FJUrl}/comments?postId=1`)
        ]);

        const mergedPost1 = {
            ...post1,
            comments: commentsForPost1
        };
        console.log("\nMerged post with ID 1 and its comments:");
        console.log(JSON.stringify(mergedPost1, null, 2));

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

runExercise();