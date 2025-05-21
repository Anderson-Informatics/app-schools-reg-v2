export default function (ctx) {
  ctx.res.setHeader('Access-Control-Allow-Origin', '*');
  ctx.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  //ctx.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //ctx.res.setHeader('Access-Control-Allow-Credentials', 'true'); // If you need credentials
}