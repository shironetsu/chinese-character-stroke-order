import { useEffect, useState } from "react";
import useWasm from "../lib/useWasm";
import {
  Box,
  Container,
  Flex,
  VStack,
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  ButtonGroup,
  Center,
  Heading,
  Icon,
  Link,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { Preset, beijing2008, beijing2022 } from "../lib/presets";
import AutoResizeTextarea from "../components/AutoResizeTextarea";
import { FaTwitter, FaGithub } from "react-icons/fa";

type TextInputs = {
  firstCountries: string;
  otherCountries: string;
  lastCountries: string;
};

function convertPreset(preset: Preset): TextInputs {
  return {
    firstCountries: preset.firstCountries.join("\n"),
    otherCountries: preset.otherCountries.join("\n"),
    lastCountries: preset.lastCountries.join("\n"),
  };
}

export default function App() {
  const [textInputs, setTextInputs] = useState<TextInputs>(
    convertPreset(beijing2022)
  );
  const [selectedPreset, setSelectedPreset] = useState<
    "2008" | "2022" | undefined
  >("2022");
  const setPartialTextInputs = (partialTextInputs: Partial<TextInputs>) => {
    setTextInputs((prev) => ({
      ...prev,
      ...partialTextInputs,
    }));
  };
  const [sortedCountries, setSortedCountries] = useState<string[]>([]);
  const [ignoredStrings, setIgnoredStrings] = useState<string[]>([]);
  const [isSorted, setIsSorted] = useState(false);

  const wasm = useWasm();

  const sort = () => {
    const a = textInputs.otherCountries
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    if (wasm.loaded && wasm.ok) {
      const sortResult = wasm.sortByStroke(a);
      setSortedCountries([
        ...textInputs.firstCountries.split("\n").filter((s) => s !== ""),
        ...sortResult.sorted,
        ...textInputs.lastCountries.split("\n").filter((s) => s !== ""),
      ]);
      setIgnoredStrings(sortResult.ignored);
      setIsSorted(true);
    }
  };

  const setPreset = (year: "2008" | "2022") => {
    const preset = (() => {
      switch (year) {
        case "2008":
          return beijing2008;
        case "2022":
          return beijing2022;
      }
    })();
    setSelectedPreset(year);
    setTextInputs(convertPreset(preset));
    if (wasm.loaded && wasm.ok) {
      const sortResult = wasm.sortByStroke(preset.otherCountries);
      setSortedCountries([
        ...preset.firstCountries,
        ...sortResult.sorted,
        ...preset.lastCountries,
      ]);
      setIgnoredStrings([]);
      setIsSorted(true);
    }
  };

  useEffect(() => {
    if (wasm.loaded) {
      if (wasm.ok) {
        sort();
      } else {
        alert("読み込みに失敗しました。");
      }
    }
  }, [wasm.loaded]);

  const handleTextInput = (key: keyof TextInputs, value: string) => {
    setSelectedPreset(undefined);
    setPartialTextInputs({
      [key]: value,
    });
    setIsSorted(false);
  };

  return (
    <Container maxWidth={"container.xl"}>
      <VStack width="full" p={4}>
        <Heading>北京オリンピック開会式入場順ソート</Heading>
        <HStack>
          <Link href="https://twitter.com/shironetsu" target={"_blank"}>
            <Icon as={FaTwitter} boxSize={6} />
          </Link>
          <Spacer />
          <Link
            href="https://github.com/shironetsu/chinese-character-stroke-order"
            target={"_blank"}
          >
            <Icon as={FaGithub} boxSize={6} />
          </Link>
        </HStack>

        <Text>
          漢字の画数と<span lang="zh-cn">笔顺编号</span>
          によって国名をソートします。
        </Text>
        <ButtonGroup>
          <Button
            onClick={() => setPreset("2008")}
            isActive={selectedPreset == "2008"}
          >
            2008年
          </Button>
          <Button
            onClick={() => setPreset("2022")}
            isActive={selectedPreset == "2022"}
          >
            2022年
          </Button>
          <Button onClick={sort}>並び替え</Button>
        </ButtonGroup>
        <Flex w="full" h="full" alignItems={"flex-start"}>
          <Box p={2} h="full" alignItems={"center"} flex={1}>
            <Flex flexFlow="column">
              <Text>先頭（固定）</Text>
              <AutoResizeTextarea
                lang="zh-cn"
                value={textInputs.firstCountries}
                onChange={({ target: { value } }) =>
                  handleTextInput("firstCountries", value)
                }
              />
              <Text>末尾（固定）</Text>
              <AutoResizeTextarea
                lang="zh-cn"
                value={textInputs.lastCountries}
                onChange={({ target: { value } }) =>
                  handleTextInput("lastCountries", value)
                }
              />
              <Text>その他の国名</Text>
              <AutoResizeTextarea
                lang="zh-cn"
                value={textInputs.otherCountries}
                onChange={({ target: { value } }) =>
                  handleTextInput("otherCountries", value)
                }
              />
            </Flex>
          </Box>
          <Box
            p={2}
            h="full"
            flex={1}
            overflowX={"scroll"}
            style={{ filter: isSorted ? undefined : "blur(2px)" }}
          >
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>
                      <Center>順番</Center>
                    </Th>
                    <Th>国名</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedCountries.map((name, i) => {
                    return (
                      <Tr key={i}>
                        <Td p={0.5}>
                          <Center>{i + 1}</Center>
                        </Td>
                        <Td p={0.5}>
                          <span lang="zh-cn">{name}</span>
                        </Td>
                      </Tr>
                    );
                  })}
                  {ignoredStrings.map((name, i) => {
                    return (
                      <Tr key={i}>
                        <Td p={0.5}>
                          <Center>？</Center>
                        </Td>
                        <Td p={0.5}>
                          <span lang="zh-cn">{name}</span>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
}
