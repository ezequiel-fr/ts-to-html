import { compileAll } from './utils/compiler';
import { clearAndLog } from './utils/log';
import server from './utils/server';

// Compile files
(async () => await compileAll())();

// Start server
server(port => clearAndLog("Server running at : " + port));
