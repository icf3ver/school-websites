let API_URL,development=!1;function apiUrl(){return API_URL+window.location.hash.substring(1)}async function handler(){let e=window.location.hash.split("%2F")[0],t=document.getElementById("content"),n=document.getElementById("menu");if(null!=n){let e=await fetch(API_URL),t=await e.json();console.log(t);let l=document.createElement("ul");if("default"==t.type){for(let[e,n]of Object.entries(t.classes)){let t=document.createElement("li");t.className="item";let a=document.createElement("a");a.href="#/"+e,a.innerText=e.replace("-"," ");let i=document.createElement("ul");i.className="submenu";for(let t=0;t<n.length;t++){let l=document.createElement("li"),a=document.createElement("a");a.href="#/"+e+"/"+n[t],a.innerText=n[t].replace("-"," "),l.appendChild(a),i.appendChild(l)}t.appendChild(a),t.appendChild(i),l.appendChild(t)}n.innerHTML="",n.appendChild(l)}}if(null!=t){let n=await fetch(apiUrl()),l=await n.json();if(console.log(l),"default"==l.type){t.innerHTML="<h1>Main</h1>";let e=document.createElement("ul");for(let[t,n]of Object.entries(l.classes)){let l=document.createElement("li");l.className="item";let a=document.createElement("a");a.href="#/"+t,a.innerText=t.replace("-"," ");let i=document.createElement("ul");i.className="submenu";for(let e of n){let n=document.createElement("li"),l=document.createElement("a");l.href="#/"+t+"/"+e,l.innerText=e.replace("-"," "),n.appendChild(l),i.appendChild(n)}l.appendChild(a),l.appendChild(i),e.appendChild(l)}t.innerHTML="<h1>Main</h1>",t.appendChild(e)}else if("class"==l.type){let e=document.createElement("ul");for(let t of l.pages){let n=document.createElement("li"),a=document.createElement("a");a.href="#/"+l["class-name"]+"/"+t,a.innerText=t.replace("-"," "),n.appendChild(a),e.appendChild(n)}t.innerHTML="<h1>"+l["class-name"].charAt(0).toUpperCase()+l["class-name"].slice(1)+"</h1>",t.appendChild(e)}else if("page"==l.type){t.innerHTML="";let n=document.createElement("h1");n.innerText=l.title,t.appendChild(n);let a=document.createElement("h5");a.innerText="by: "+l.author,a.style.marginTop="0%",t.appendChild(a);for(let n of l.elem)if("navbar"==n.type){let l=document.createElement("div");l.className="navbar";let a=!0;for(let t of n.navelem){document.createElement("div");if(!a){let e=document.createElement("div");e.innerText=" | ",e.className="navelem-spacer",l.appendChild(e)}let n=document.createElement("a");n.className="navelem",n.innerText=t.name,n.href=e+t.link,l.appendChild(n),a=!1}t.appendChild(l)}else if("subtitle"==n.type){let e=document.createElement("h3");e.innerText=n.text,t.appendChild(e)}else if("text"==n.type){let e=document.createElement("h4");e.innerText=n.text,t.appendChild(e)}else if("img"==n.type){let e=document.createElement("img");e.src=API_URL+"/img/"+n.name,e.style.width="100%",t.appendChild(e)}else if("wrapimg"==n.type){let e=document.createElement("div"),l=document.createElement("div"),a=document.createElement("img");a.src=API_URL+"/img/"+n.name,a.style.width="100%","right"==n.side?(l.style.float="right",e.style.float="right",l.appendChild(a),l.style.width=n.width,e.style.width=99-parseInt(n.width.substring(0,2))+"%",l.style.paddingLeft="1%",t.appendChild(l),t.appendChild(e)):(l.style.float="left",e.style.float="left",e.appendChild(a),e.style.width=n.width,l.style.width=99-parseInt(n.width.substring(0,2))+"%",e.style.paddingRight="1%",t.appendChild(e),t.appendChild(l))}else if("citation"==n.type){let e=document.createElement("p");e.className="citation",e.innerText=n.text,t.appendChild(e)}}}}API_URL=development?"http://localhost:8000/":"http://littletitan.org:8080/",window.addEventListener("load",handler),window.addEventListener("hashchange",handler,!1);
//# sourceMappingURL=index.7c468229.js.map