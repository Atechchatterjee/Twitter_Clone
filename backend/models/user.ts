export default (sequelize: any, DataTypes: any) => {
  const Users = sequelize.define(
    "Users",
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      displayName: DataTypes.STRING,
      description: DataTypes.TEXT,
      profilePicture: DataTypes.STRING,
    },
    {}
  );
  return Users;
};
