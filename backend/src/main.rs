#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use rocket::{
    http::{Method, Status},
    response::NamedFile,
};
use rocket_contrib::json::JsonValue;
use rocket_cors::{AllowedHeaders, AllowedOrigins};
use std::{collections::HashMap, fs, path::PathBuf};

#[get("/")]
fn default() -> Result<JsonValue, JsonValue> {
    let json_dir = PathBuf::from("json");

    let classes = fs::read_dir(&json_dir)
        .expect("Unable to read path")
        .map(|class_path| {
            let class_dir = class_path.expect("failed reading path in ./json");

            let class_name = class_dir.file_name().to_string_lossy().to_string();

            let mut class_path = json_dir.clone();
            class_path.push(&class_name);

            if let Ok(meta) = class_dir.metadata() {
                if !meta.is_dir() {
                    panic!("{} is not a directory", class_path.to_string_lossy())
                }
            }

            let files = fs::read_dir(&class_path)
                .expect(&format!("Unable to read {}", class_path.to_string_lossy()))
                .map(|file_path| {
                    file_path
                        .expect(&format!("unable to read {}", class_path.to_string_lossy()))
                        .file_name()
                        .to_string_lossy()
                        .to_string()
                        .replace(".json", "")
                })
                .collect::<Vec<_>>();

            (class_name, files)
        })
        .collect::<HashMap<_, _>>();

    Ok(json!({
        "type": "default",
        "classes": classes
    }))
}

#[get("/<class>", rank = 1)]
fn class(class: String) -> Option<JsonValue> {
    match fs::read_dir(format!("./json/{}", class)) {
        Ok(files) => {
            let pages = files
                .map(|page| {
                    page.unwrap()
                        .file_name()
                        .to_string_lossy()
                        .to_string()
                        .replace(".json", "")
                })
                .collect::<Vec<_>>();

            Some(json!({
                "type": "class",
                "class-name": class,
                "pages": pages
            }))
        }
        Err(_) => None,
    }
}

#[get("/<class>/<name>", rank = 1)]
fn page(class: String, name: String) -> Option<NamedFile> {
    let file = NamedFile::open(PathBuf::from(format!("./json/{}/{}.json", class, name)));

    if let Ok(f) = file {
        Some(f)
    } else {
        None
    }
}

#[get("/img/<id>")]
fn img(id: String) -> Option<NamedFile> {
    let file = NamedFile::open(PathBuf::from(format!("./img/{}", id)));

    if let Ok(f) = file {
        Some(f)
    } else {
        None
    }
}

#[get("/favicon.ico")]
fn favicon() -> Status {
    Status::NotFound
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
    }
    .to_cors();

    rocket::ignite()
        .mount("/", routes![default, class, page, img, favicon])
        .attach(cors.unwrap())
        .launch();
}
