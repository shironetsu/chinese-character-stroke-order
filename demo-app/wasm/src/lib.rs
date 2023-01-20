mod utils;

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
