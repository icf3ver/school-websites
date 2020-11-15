#![feature(proc_macro_hygiene, decl_macro)]

use std::{fs::File, io::Read, path::Path, fs};

use rocket::http::Method;
use rocket::{response::{NamedFile, content}};
use rocket_cors::AllowedOrigins;
use rocket_cors::{AllowedHeaders, Error};

#[macro_use] extern crate rocket;
extern crate rocket_cors;

#[get("/")]
fn default() -> content::Json<String> {
    let mut dirs = &mut fs::read_dir("./json").unwrap();
    let mut dirs2 = &mut fs::read_dir("./json").unwrap();
    let mut json: &mut String = &mut "{'type': 'default', 'classes': [".to_string();
    for path in dirs.into_iter() {
        let class = path.unwrap().file_name().to_str().unwrap().to_string();
        json.push_str(&("'".to_string() + &class[..] + "', "));
    }// yea yea i know i had 3 hrs to make this chill
    json.pop();
    json.pop();
    if (json.to_string() + ":").contains("::"){
        json.push_str(" [");
    }
    json.push_str("], ");

    for path in dirs2.into_iter() {
        let class = path.unwrap().file_name().to_str().unwrap().to_string();
        json.push_str(&("'".to_string() + &class[..] + "': ["));

        let pages_raw = fs::read_dir(&("./json/".to_string() + &class[..])).unwrap();
        for page in pages_raw.into_iter() {
            json.push_str(&("'".to_string() + &page.unwrap().file_name().to_str().unwrap().to_string().split(".").into_iter().collect::<Vec<&str>>()[0] + "', "));
        }
        json.pop();
        json.pop();
        if (json.to_string() + ":").contains("::"){
            json.push_str(" [");
        }
        json.push_str("], ");
    }
    json.pop();
    json.pop();
    json.push_str("}");
    println!("{}", json);
    content::Json(json.to_string())
}

#[get("/<class>")]
fn class(class: String) -> content::Json<String> {
    let mut json: &mut String = &mut ("{'type': 'class', 'class-name': '".to_string() + &class[..] + "', 'pages': [");
    let pages_raw = fs::read_dir(&("./json/".to_string() + &class[..])).unwrap();
    for page in pages_raw.into_iter() {
        json.push_str(&("'".to_string() + &page.unwrap().file_name().to_str().unwrap().to_string().split(".").into_iter().collect::<Vec<&str>>()[0] + "', "));
    }
    json.pop();
    json.pop();
    if (json.to_string() + ":").contains("::"){
        json.push_str(" [");
    }
    json.push_str("]}");
    println!("{}", json);
    content::Json(json.to_string())
}

#[get("/<class>/<name>")]
fn page(class: String, name: String) -> content::Json<String> {
    content::Json(std::fs::read_to_string(format!("./json/{}/{}.json", class, name)).unwrap())
}

#[get("/assets/img/<id>")]
fn img(id: String) -> Option<NamedFile> {
    NamedFile::open(Path::new(&("./img/".to_owned() + &id[..]))).ok()
}

fn main() {
    let allowed_origins = AllowedOrigins::all();

    // You can also deserialize this
    let cors = rocket_cors::CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::some(&["Authorization", "Accept"]),
        allow_credentials: true,
        ..Default::default()
    }.to_cors();

    rocket::ignite().mount("/", routes![default, class, page, img]).attach(cors.unwrap()).launch();
}