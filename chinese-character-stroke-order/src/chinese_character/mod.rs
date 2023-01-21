pub mod stroke_table;
use stroke_table::STROKE_TABLE;

#[derive(PartialEq, Eq, Clone, Copy, Debug, Ord)]
pub struct ChineseCharacter {
    value: char,
}

impl ChineseCharacter {
    pub fn from(c: char) -> Result<Self, StrokeIsUnknownError> {
        if STROKE_TABLE.contains_key(&c) {
            Ok(ChineseCharacter { value: c })
        } else {
            Err(StrokeIsUnknownError { character: c })
        }
    }

    #[allow(dead_code)]
    pub fn from_unchecked(c: char) -> Self {
        Self::from(c).unwrap()
    }

    pub fn to_char(&self) -> char {
        self.value
    }
}

#[derive(Debug, Clone)]
pub struct StrokeIsUnknownError {
    character: char,
}

impl PartialOrd for ChineseCharacter {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        let a = STROKE_TABLE.get(&self.value).unwrap();
        let b = STROKE_TABLE.get(&other.value).unwrap();
        Some(a.len().cmp(&b.len()).then_with(|| a.cmp(&b)))
    }
}

#[derive(PartialEq, Eq, Clone, Debug, PartialOrd, Ord)]
pub struct ChineseString {
    chars: Vec<ChineseCharacter>,
}

impl ChineseString {
    pub fn from(s: String) -> Result<Self, ContainsUnexpectedCharError> {
        let mut chars = vec![];
        for (i, c) in s.chars().enumerate() {
            let res = ChineseCharacter::from(c);
            if res.is_ok() {
                chars.push(res.unwrap());
            } else {
                return Err(ContainsUnexpectedCharError {
                    position: i,
                    character: c,
                });
            }
        }
        Ok(ChineseString { chars })
    }

    pub fn to_string(&self) -> String {
        self.chars.iter().map(|c| c.to_char()).collect::<String>()
    }
}

#[derive(Debug, Clone)]
pub struct ContainsUnexpectedCharError {
    #[allow(dead_code)]
    position: usize,
    #[allow(dead_code)]
    character: char,
}
