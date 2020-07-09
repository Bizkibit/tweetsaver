export const searchTweet = query =>
  fetch("/api/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  })
    .then(res => res.json())
    .then(({ data = {} }) => {
      const { statuses = [] } = data;
      const tweets = {};
      statuses
        .map(status => {
          const { id_str: id, text: content } = status;
          return {
            id,
            content
          };
        })
        .forEach(status => (tweets[status.id] = status));
      return tweets;
    }).catch(console.error);
