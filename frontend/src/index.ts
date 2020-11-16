let API_URL: string;

if (process.env.NODE_ENV === 'production') {
    API_URL = "http://localhost:8000/"; // FIXME:
} else {
    API_URL = "http://localhost:8000/";
}
function apiUrl() {
    return API_URL + window.location.hash.substring(1);
}

interface Subtitle{
    type: "subtitle",
    text: string,
}

interface Text{
    type: "text",
    text: string,
}

interface Img{
    type: "img",
    name: string,
}

interface Wrapimg{
    type: "wrapimg",
    name: string,
    side: "left" | "right",
    width: string,
}

interface DefaultResponse {
    type: "default",
    classes: Record<string, string[]>
}

interface ClassResponse {
    type: "class",
    "class-name": string,
    pages: string[]
}

interface PageResponse {
    type: "page",
    title: string,
    author: string,
    elem: (Subtitle | Text | Img | Wrapimg)[]
}

type ResponseJson = DefaultResponse | ClassResponse | PageResponse;

window.addEventListener("load", handler);
window.addEventListener("hashchange", handler, false);

async function handler() {
    let content = document.getElementById("content");
    let menu = document.getElementById("menu");

    if (menu != null) {
        let menu_data_request = await fetch(API_URL);
        // if (!menu_data_request.ok) {
        //     // show the user some error!~
        // }
        let obj: DefaultResponse = await menu_data_request.json();
        console.log(obj);

        let wrapper = document.createElement("ul");
        if (obj.type == 'default'){
            for (let [class_name, class_items] of Object.entries(obj.classes)) {
            
                let cls = document.createElement("li");
                cls.className = "item";
    
                let link_1 = document.createElement("a");
                link_1.href = "#/" + class_name;
                link_1.innerText = class_name.replace("-", " ");
                let wrapper2 = document.createElement("ul");
                wrapper2.className = "submenu";
                for (let p = 0; p < class_items.length; p++) {
                    let page = document.createElement("li");
                    let link_2 = document.createElement("a");
                    link_2.href = "#/" + class_name + "/" + class_items[p];
                    link_2.innerText = class_items[p].replace("-", " ");
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
        
    }

    if (content != null) {
        let content_request = await fetch(apiUrl());

        let obj: ResponseJson = await content_request.json();
        console.log(obj);

        if (obj.type == 'default') {
            content.innerHTML = "<h1>Main</h1>";

            let wrapper = document.createElement("ul");
            for (let [class_name, class_items] of Object.entries(obj.classes)) {
                let cls = document.createElement("li");
                cls.className = "item";

                let link_1 = document.createElement("a");
                link_1.href = "#/" + class_name;
                link_1.innerText = class_name.replace("-", " ");
                let wrapper2 = document.createElement("ul");
                wrapper2.className = "submenu";

                for (let class_item of class_items) {
                    let page = document.createElement("li");
                    let link_2 = document.createElement("a");
                    link_2.href = "#/" + class_name + "/" + class_item;
                    link_2.innerText = class_item.replace("-", " ");
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
        } else if (obj.type == 'class') {
            let wrapper = document.createElement("ul");
            for (let page of obj.pages) {
                let p = document.createElement("li");
                let link = document.createElement("a");
                link.href = "#/" + obj["class-name"] + "/" + page;
                link.innerText = page.replace("-", " ");
                p.appendChild(link);

                wrapper.appendChild(p);
            }

            content.innerHTML = "<h1>" + obj["class-name"].charAt(0).toUpperCase() + obj["class-name"].slice(1) + "</h1>";
            content.appendChild(wrapper);
            content.style.paddingRight = "2em";
            content.style.paddingLeft = "2em";

            content.style.paddingTop = "1em";
            content.style.paddingBottom = "1em";
            content.style.height = "100%";
        } else if (obj.type == 'page') {
            //content is wrapper
            content.innerHTML = "";

            let title = document.createElement("h1");
            title.innerText = obj.title;
            content.appendChild(title);

            let author = document.createElement("h5");
            author.innerText = "by: " + obj.author;
            author.style.marginTop = "0%";
            content.appendChild(author);

            for (let elem of obj.elem) {
                if (elem.type == "subtitle") {
                    let subtitle = document.createElement("h3");
                    subtitle.innerText = elem.text;
                    content.appendChild(subtitle);
                } else if (elem.type == "text") {
                    let text = document.createElement("h4");
                    text.innerText = elem.text;
                    content.appendChild(text);
                } else if (elem.type == "img") {
                    let img = document.createElement("img");
                    img.src = API_URL + "/img/" + elem.name;
                    img.style.width = "100%";
                    content.appendChild(img);
                } else if (elem.type == "wrapimg") {
                    let left = document.createElement("div");
                    let right = document.createElement("div");

                    let img = document.createElement("img");
                    img.src = API_URL + "/img/" + elem.name;
                    img.style.width = "100%";

                    if (elem.side == "right") {
                        right.style.float = "right";
                        left.style.float = "right";
                        right.appendChild(img);
                        right.style.width = elem.width;
                        left.style.width = 100 - parseInt(elem.width.substring(0,2)) + "%";

                        content.appendChild(right);
                        content.appendChild(left);
                    } else {
                        right.style.float = "left";
                        left.style.float = "left";
                        left.appendChild(img);
                        left.style.width = elem.width;
                        right.style.width = 100 - parseInt(elem.width.substring(0,2)) + "%";

                        content.appendChild(left);
                        content.appendChild(right);
                    }
                }
            }
        }
    }
};