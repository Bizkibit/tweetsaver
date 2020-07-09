import { prepareTweetsObject } from './utils/prepareTweetsObject'

export const searchTweet = query =>
  fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  })
    .then(res => res.json())
    .then(({ data = {} }) => {
      const { statuses = [] } = data;
      const tweets = prepareTweetsObject(statuses);
      return tweets;
    })
    .catch(console.error);

    export const readTweets = ids =>
  fetch("/api/readTweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ids })
  })
    .then(res => res.json())
    .then(({ data = [] }) => {
      const tweets = prepareTweetsObject(data);
      return tweets;
    })
    .catch(console.error);
