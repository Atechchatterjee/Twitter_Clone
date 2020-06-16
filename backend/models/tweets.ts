export default (sequelize: any, DataTypes: any) => {
  const tweets = sequelize.define(
    "Tweets",
    {
      //   tweet_id: DataTypes.INTEGER,
      fromUser: DataTypes.STRING,
      toUser: DataTypes.STRING,
      tweet: DataTypes.TEXT,
      likes: DataTypes.INTEGER,
    },
    {}
  );
  return tweets;
};
