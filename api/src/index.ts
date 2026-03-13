import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(port, () => {
  // Intentional startup log for runtime diagnostics.
  console.log(`API listening on port ${port}`);
});
