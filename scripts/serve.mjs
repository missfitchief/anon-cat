import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain','.json':'application/json'};
http.createServer(async(req,res)=>{
  try{
    const u=new URL(req.url||'/', 'http://localhost');
    const decoded=decodeURIComponent(u.pathname);
    let p=path.resolve(root,'.'+decoded);
    if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(decoded.endsWith('/'))p=path.join(p,'index.html');
    let bytes;try{bytes=await fs.readFile(p);}catch{if(!path.extname(p)){p+='.html';bytes=await fs.readFile(p);}else throw new Error('404');}
    res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'"});
    res.end(bytes);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(3001,'127.0.0.1',()=>console.log('Production preview: http://127.0.0.1:3001'));
