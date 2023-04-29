export const mongoConfig = {
  // serverUrl: 'mongodb://localhost:27017/',
  serverUrl: "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.1",
  // serverUrl:`mongodb+srv://${process.env.username}:${process.env.password}@tradebridge.a8beqtm.mongodb.net/test`,
  database: "TradeBridgeDB",
};
