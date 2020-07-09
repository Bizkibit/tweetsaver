export const prepareTweetsObject = (data) => {
    const tweets = {};
    data
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
}