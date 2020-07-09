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
          const {
            id_str: id,
            text: content,
            created_at: date,
            user: {
              name,
              profile_image_url_https: pic,
              screen_name: handle
            } = {}
          } = status;
          return {
            id,
            content,
            name,
            pic,
            handle,
            date
          };
        })
        .forEach(status => (tweets[status.id] = status));
      return tweets;
    })
    .catch(console.error);
