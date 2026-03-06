export default defineEventHandler(async (event) => {
  const starttime = new Date().toLocaleTimeString();
  return starttime;
});
