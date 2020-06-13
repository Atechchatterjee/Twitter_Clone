export default (sequelize: any, DataTypes: any) => {
  const follows = sequelize.define(
    "Follows",
    {
      fromUser: DataTypes.STRING,
      toUser: DataTypes.STRING,
      followed: DataTypes.BOOLEAN,
    },
    {}
  );
  return follows;
};
