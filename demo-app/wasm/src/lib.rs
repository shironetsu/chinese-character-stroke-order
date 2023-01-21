mod utils;

use js_sys::Array;
use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;
use chinese_character_stroke_order::chinese_character::{ChineseCharacter, ChineseString};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm!");
}

#[wasm_bindgen]
pub fn convert(s: String)->String{
    if ChineseString::from(s).is_ok() {
        String::from("OK")
    } else {
        String::from("NO")
    }
}

#[wasm_bindgen(typescript_custom_section)]
const TYPE_SORT: &'static str = r#"
export function sort(s: string[]): string[];
"#;

#[wasm_bindgen(skip_typescript)]
pub fn sort(v: js_sys::Array)->js_sys::Array{
    let mut v = v.iter().map(|x|{
        x.as_string().unwrap()
    }).collect::<Vec<_>>();
    v.sort_by_key(|s|s.len());
    let a = Array::new_with_length(v.len() as u32);
    v.iter().enumerate().for_each(|(i, x)|{
        let x = JsValue::from_str(x);
        a.set(i as u32, x);
    });
    a
}


#[derive(Serialize, Deserialize)]
pub struct SortResult{
    pub sorted: Vec<String>,
    pub ignored: Vec<String>
}

#[wasm_bindgen(typescript_custom_section)]
const TYPE_SORT_BY_STROKE: &'static str = r#"
export function sortByStroke(s: string[]): {
    sorted: string[],
    ignored: string[],
};
"#;

#[wasm_bindgen(skip_typescript, js_name="sortByStroke")]
pub fn sort_by_stroke(v: js_sys::Array)->Result<JsValue, JsValue>{
    let mut sortable = vec![];
    let mut ignored = vec![];
    v.iter().map(|x|{
        x.as_string().unwrap()
    }).for_each(|s|{
        match ChineseString::from(s.clone()) {
            Ok(s) => sortable.push(s),
            Err(_) => ignored.push(s),   
        }
    });

    sortable.sort();

    let sorted = sortable.iter().map(|s|{
        s.to_string()
    }).collect::<Vec<_>>();

    let result = SortResult {
        sorted,
        ignored,
    };

    Ok(serde_wasm_bindgen::to_value(&result)?)    
}