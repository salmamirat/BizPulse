import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Conversation = sequelize.define("Conversation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  entrepriseId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Conversation;
