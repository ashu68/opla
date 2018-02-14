// TODO load config

const config = {
  name: "Opla.ai",
  version: "0.9.0",
  // Global Database
  global: {
    database: {
      datatype: "mysql",
      host: "127.0.0.1",
      name: "opla_dev",
      user: "root",
      charset: "utf8mb4",
      version: "2",
    },
    api: {
      endpoint: "/api",
      version: "1",
      port: 8081,
    },
    botSite: {
      url: "http://127.0.0.1:8085/?b=",
    },
  },
  auth: {
    database: {
      parent: "global",
      name: "auth",
    },
    api: {
      endpoint: "/auth",
    },
  },
  messenger: {
    database: {
      parent: "global",
      name: "messenger",
    },
  },
  users: {
    database: {
      parent: "global",
      name: "users",
    },
  },
  bots: {
    database: {
      parent: "global",
      name: "bots",
    },
  },
  webhooks: {
    database: {
      parent: "global",
      name: "webhooks",
    },
  },
  middlewares: {
    database: {
      parent: "global",
      name: "middlewares",
    },
  },
  parameters: {
    database: {
      parent: "global",
      name: "parameters",
    },
  },
};

export default () => config;
