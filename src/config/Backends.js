const backends = {
  SERVERS: [
    {
      serverName: 'Kyiv',
      serverAddress: 'https://ip-2c41.proline.net.ua:49173',
    },
    {
      serverName: 'Yalinka',
      serverAddress: 'https://176.104.16.214:34148',
    },
    {
      serverName: 'Yudin',
      serverAddress: 'https://77.121.5.210:51569',
    },
  ],
};

if (__DEV__) {
  backends.SERVERS = backends.SERVERS.concat([
    {
      serverName: 'ios-dev',
      serverAddress: 'http://localhost:9000',
    },
    {
      serverName: 'android-dev',
      serverAddress: 'http://10.0.2.2:9000',
    }],
  );
}

export {backends};
