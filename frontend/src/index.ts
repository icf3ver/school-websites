function httpGet(theUrl: string){
    console.log(theUrl);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

window.addEventListener("load", () => {
    let content = document.getElementById("content");
    let menu = document.getElementById("menu");
    
    if (menu != null){
        var menu_data = httpGet(document.URL.split("1234")[0] + "8000/").split("'").join('"');
        var obj = JSON.parse(menu_data);

        let wrapper = document.createElement("ul");
        for (let c = 0; c < obj.classes.length; c++){
            let cls = document.createElement("li");
            cls.className = "item";

            let link_1 = document.createElement("a");
            link_1.href = "/" + obj.classes[c];
            link_1.innerText = obj.classes[c].replace("-", " ");
            let wrapper2 = document.createElement("ul");
            wrapper2.className = "submenu";
            for (let p = 0; p < obj[obj.classes[c]].length; p++){
                let page = document.createElement("li");
                let link_2 = document.createElement("a");
                link_2.href = "/" + obj.classes[c] + "/" + obj[obj.classes[c]][p];
                link_2.innerText = obj[obj.classes[c]][p].replace("-", " ");
                page.appendChild(link_2);

                wrapper2.appendChild(page);
            }
            cls.appendChild(link_1);
            cls.appendChild(wrapper2);
            wrapper.appendChild(cls);
        }
        menu.innerHTML = "";
        menu.appendChild(wrapper);

        
    }
    if (content != null){
        var content_data = httpGet(document.URL.replace("1234", "8000")).split("'").join('"');
        var obj = JSON.parse(content_data);
        console.log(obj);

        if (obj.type == 'default'){
            content.innerHTML = "<h1>Main</h1>";
            var menu_data = httpGet(document.URL.split("1234")[0] + "8000/").split("'").join('"');
            var obj = JSON.parse(menu_data);

            let wrapper = document.createElement("ul");
            for (let c = 0; c < obj.classes.length; c++){
                let cls = document.createElement("li");
                cls.className = "item";

                let link_1 = document.createElement("a");
                link_1.href = "/" + obj.classes[c];
                link_1.innerText = obj.classes[c].replace("-", " ");
                let wrapper2 = document.createElement("ul");
                wrapper2.className = "submenu";
                for (let p = 0; p < obj[obj.classes[c]].length; p++){
                    let page = document.createElement("li");
                    let link_2 = document.createElement("a");
                    link_2.href = "/" + obj.classes[c] + "/" + obj[obj.classes[c]][p];
                    link_2.innerText = obj[obj.classes[c]][p].replace("-", " ");
                    page.appendChild(link_2);

                    wrapper2.appendChild(page);
                }
                cls.appendChild(link_1);
                cls.appendChild(wrapper2);
                wrapper.appendChild(cls);
            }
            content.innerHTML = "<h1>Main</h1>";
            content.appendChild(wrapper);
            content.style.paddingRight = "2em";
            content.style.paddingLeft = "2em";
            
            content.style.paddingTop = "1em";
            content.style.paddingBottom = "1em";
            content.style.height = "100%";
        }else if (obj.type == 'class'){
            let wrapper = document.createElement("ul");
            for (let p = 0; p < obj.pages.length; p++){
                let page = document.createElement("li");
                let link = document.createElement("a");
                link.href = "/" + obj["class-name"] + "/" + obj.pages[p];
                link.innerText = obj.pages[p].replace("-", " ");
                page.appendChild(link);

                wrapper.appendChild(page);
            }

            content.innerHTML = "<h1>" + obj["class-name"].charAt(0).toUpperCase() + obj["class-name"].slice(1) + "</h1>";
            content.appendChild(wrapper);
            content.style.paddingRight = "2em";
            content.style.paddingLeft = "2em";

            content.style.paddingTop = "1em";
            content.style.paddingBottom = "1em";
            content.style.height = "100%";
        }else if (obj.type == 'page'){
            //content is wrapper
            content.innerHTML = "";

            let title = document.createElement("h1");
            title.innerText = obj.title;
            content.appendChild(title);

            let author = document.createElement("h5");
            author.innerText = obj.author;
            content.appendChild(author);

            for (let i = 0; i < obj.elem.length; i++){
                if (obj.elem[i].type == "subtitle"){
                    let subtitle = document.createElement("h3");
                    subtitle.innerText = obj.elem[i].text;
                    content.appendChild(subtitle);
                }else if (obj.elem[i].type == "text"){
                    let text = document.createElement("h4");
                    text.innerText = obj.elem[i].text;
                    content.appendChild(text);
                }else if (obj.elem[i].type == "img"){
                    let img = document.createElement("img");
                    img.src = document.URL.split("1234")[0] + "8000/assets/img/" + obj.elem[i].name;
                    img.style.width = "100%";
                    content.appendChild(img);
                }else if (obj.elem[i].type == "split"){
                    let left = document.createElement("div");
                    let right = document.createElement("div");
                    
                    left.className = "split";
                    right.className = "split";
                    if (obj.elem[i].left.type == "text"){
                        let text = document.createElement("h5");
                        text.innerText = obj.elem[i].left.text;
                        text.style.color = "rgba(0,0,0,0.5)";
                        left.appendChild(text);
                    }else if (obj.elem[i].left.type == "img"){
                        let img = document.createElement("img");
                        img.src = document.URL.split("1234")[0] + "8000/assets/img/" + obj.elem[i].left.name;
                        img.style.width = "100%";
                        left.appendChild(img);
                    }

                    if (obj.elem[i].right.type == "text"){
                        let text = document.createElement("h5");
                        text.innerText = obj.elem[i].right.text;
                        text.style.color = "rgba(0,0,0,0.5)";
                        right.appendChild(text);
                    }else if (obj.elem[i].right.type == "img"){
                        let img = document.createElement("img");
                        img.src =  document.URL.split("1234")[0] + "8000/assets/img/" + obj.elem[i].right.name;
                        img.style.width = "100%";
                        right.appendChild(img);
                    }

                    content.appendChild(right);
                    content.appendChild(left);

                }
            }
        }
    }
});